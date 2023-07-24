from flask import Blueprint, request, jsonify
from flask_praetorian import current_user, auth_required
from app.extensions import db
from app.models.cuisine import Cuisine, cuisine_schema_list
from app.models.cooks_cuisine import CooksCuisine
from app.models.eatery import Eatery


cuisine = Blueprint('cuisine', __name__)


@cuisine.route('/cuisines', methods=['GET', 'POST'])
@auth_required
def cuisines():

    """Function to handle get all Cuisines and Update Menu Cuisines"""
    
    if request.method == 'POST':

        if not isinstance(current_user(), Eatery):
            return jsonify(success=False), 403
        
        try:
            updated_cuisine_ids = request.json.get('cuisineIds', [])
            print("updated_cuisine_ids", updated_cuisine_ids)
            # Delete current cuisines for this eatery
            current_eatery_id = current_user().id
            CooksCuisine.query.filter_by(eatery_id=current_eatery_id).delete()

            # Add updated cuisine IDs to CooksCuisine
            for cuisine_id in updated_cuisine_ids:
                cooks_cuisine = CooksCuisine(eatery_id=current_eatery_id, cuisine_id=cuisine_id)
                db.session.add(cooks_cuisine)

            db.session.commit()
            
            return jsonify({'success': True, 'message': 'Menu Cuisines Updated'}), 200
        
        except Exception as e:
            db.session.rollback()
            print(f"Error: {e}")
            return jsonify({'success': False, 'message': 'An error occurred while updating cuisines'}), 500

    
    cuisines = Cuisine.query.all()
    return cuisine_schema_list.dump(cuisines), 200


