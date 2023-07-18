from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models.customer import Customer, customer_schema
from app.models.eatery import Eatery, eatery_schema
from app.models.user import User
from app.extensions import db

user = Blueprint('user', __name__)

@login_required
@user.route('/customer/profile/', methods=['GET'])
def get_customer():
    if not isinstance(current_user, Customer):
        return jsonify(success=False), 403

    return customer_schema.dump(current_user)

@login_required
@user.route('/customer/edit-profile/', methods=['POST'])
def edit_customer():
    if not isinstance(current_user, Customer):
        return jsonify(success=False), 403

    customer = User.query.get_or_404(current_user.id)
    data = request.get_json()
    customer.name = data.get('name', customer.name)
    customer.email = data.get('email', customer.email)

    if 'password' in data:
        customer.hash_password(data.get('password'))

    db.session.commit()
    return jsonify({"message": "Customer updated"}), 200

@login_required
@user.route('/eatery/edit-profile/', methods=['PUT'])
def edit_eatery():
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

@login_required
@user.route('/eatery/profile', methods=['GET'])
def get_eatery():
    if not isinstance(current_user, Eatery):
        return jsonify(success=False), 403

    return eatery_schema.dump(current_user), 200
