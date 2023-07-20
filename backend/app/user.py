from flask import Blueprint, request, jsonify
from flask_praetorian import current_user, auth_required

from app.models.customer import Customer, customer_schema
from app.models.eatery import Eatery, eatery_schema
from app.models.user import User
from app.extensions import db, guard

user = Blueprint('user', __name__)

@user.route('/customer/profile', methods=['GET'])
@auth_required
def get_customer():
    current_user = current_user()
    
    if not isinstance(current_user, Customer):
        return jsonify(success=False), 403

    return customer_schema.dump(current_user)

@user.route('/customer/edit-profile', methods=['POST'])
@auth_required
def edit_customer():
    current_user = current_user()

    if not isinstance(current_user, Customer):
        return jsonify(success=False), 403

    data = request.get_json()
    
    
    current_user.name = data.get('name', current_user.name)
    current_user.email = data.get('email', current_user.email)

    if 'password' in data:
        current_user.password_hash - guard.hash_password(data.get('password'))

    db.session.commit()
    return jsonify({"message": "Customer updated"}), 200

@user.route('/eatery/edit-profile', methods=['PUT'])
@auth_required
def edit_eatery():
    current_user = current_user()
    
    if not isinstance(current_user, Eatery):
        return jsonify(success=False), 403

    data = request.get_json()
    
    
    current_user.restaurant_name = data.get('restaurant_name', current_user.restaurant_name)
    current_user.location = data.get('location', current_user.location)
    current_user.email = data.get('email', current_user.email)

    if 'password' in data:
        current_user.hash_password(data.get('password'))

    db.session.commit()
    return jsonify({"message": "Eatery updated"}), 200

@user.route('/eatery/profile', methods=['GET'])
@auth_required
def get_eatery():
    current_user = current_user()
    
    if not isinstance(current_user, Eatery):
        return jsonify(success=False), 403

    return eatery_schema.dump(current_user), 200

# get users' PUBLIC information
@user.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = Customer.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # return the user's data
    return jsonify({
        "id": user.id,
        "name": user.name,
        # add any other fields you want to return here
    }), 200
