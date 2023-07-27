from flask import Blueprint, request, jsonify
from flask_praetorian import auth_required, current_user
from sqlalchemy import and_ 

from app.models.cuisine import Cuisine
from app.models.likes_cuisine import LikesCuisine, likes_cuisine_schema_list
from app.extensions import db

preferences = Blueprint('preferences', __name__)

#this is only for the first time (when user registers)
@preferences.route('/add_preferences', methods=['POST'])
@auth_required
def add_preferences():
    # customer_id = request.json.get('customer_id')
    curr_user_obj = current_user()
    cuisines_picked = request.json.get('cuisines')

    preferences = LikesCuisine.query.filter(LikesCuisine.customer_id==curr_user_obj.id).all()
    if len(preferences) != 0:
        for preference in preferences:
            db.session.delete(preference)
            db.session.commit()

    all_cuisines = Cuisine.query.all()
    for cuisine in all_cuisines:
        if cuisine.cuisine_name in cuisines_picked:
            likes_cuisine = LikesCuisine(customer_id=curr_user_obj.id, cuisine_id=cuisine.id, affinity=0.85, specified=True)
        else:  
            likes_cuisine = LikesCuisine(customer_id=curr_user_obj.id, cuisine_id=cuisine.id, affinity=0.5, specified=False)
        db.session.add(likes_cuisine)
        db.session.commit()

    # for cuisine_name in cuisines_picked:
    #     cuisine = Cuisine.query.filter(Cuisine.cuisine_name.ilike(f"%{cuisine_name}%")).first()
    #     likes_cuisine = LikesCuisine.query.filter(and_(LikesCuisine.customer_id==customer_id,LikesCuisine.cuisine_id==cuisine.id)).first()
    #     likes_cuisine.affinity = 0.85
    #     db.session.commit()

    return jsonify({'message': f'preferences for customer ({curr_user_obj.id}) added'}), 200

@preferences.route('/get_preferences/<int:customer_id>', methods=['GET'])
@auth_required
def get_customer_preferences(customer_id):
    preferences = LikesCuisine.query.filter(and_(LikesCuisine.customer_id==customer_id,LikesCuisine.specified==True)).all()

    return likes_cuisine_schema_list.dump(preferences), 200

# @preferences.route('/edit_preferences/<int:customer_id>', methods=['PUT'])
# @auth_required
# def edit_preferences(customer_id):
#     cuisines_picked = request.json.get('cuisines')

#     preferences = LikesCuisine.query.filter(LikesCuisine.customer_id==customer_id).all()

#     for cuisine_name in cuisines_picked:
#         cuisine = Cuisine.query.filter(Cuisine.cuisine_name.ilike(f"%{cuisine_name}%")).first()
#         likes_cuisine = LikesCuisine.query.filter(and_(LikesCuisine.customer_id==customer_id,LikesCuisine.cuisine_id==preferences.cuisine_id)).first()
#         likes_cuisine.affinity = 0.85
#         db.session.commit()
