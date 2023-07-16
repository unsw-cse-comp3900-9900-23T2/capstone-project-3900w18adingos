from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models.customer import Customer
from app.models.eatery import Eatery
from app.extensions import db
from app.auth_helper import user_is_eatery
from app.auth_helper import token_required


user = Blueprint('user', __name__)

@token_required
@user.route('/customer/profile/', methods=['GET'])
def get_customer():
    token = request.args['token']
    customer_id = Customer.decode_auth_token(token)
    if not isinstance(customer_id, int):
        return jsonify({"message": customer_id}), 400

    customer = Customer.query.get(customer_id)
    customer_data = {
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'handle': customer.handle,
        #'profile_pic': customer.profile_pic
    }

    return jsonify(customer_data)

@token_required
@user.route('/customer/edit-profile/', methods=['POST'])
def edit_customer():
    token = request.json.get('token')
    customer_id = Customer.decode_auth_token(token)
    if not isinstance(customer_id, int):
        return jsonify({"message": customer_id}), 400 

    customer = Customer.query.get(customer_id)
    data = request.get_json()
    customer.name = data.get('name', customer.name)
    customer.email = data.get('email', customer.email)

    if 'password' in data:
        customer.hash_password(data.get('password'))

    customer.handle = data.get('handle', customer.handle)
    #customer.profile_pic = data.get('profile_pic', customer.profile_pic)

    db.session.commit()
    return jsonify({"message": "Customer updated"}), 200

@token_required
@user.route('/eatery/edit-profile/', methods=['PUT'])
def edit_eatery():
    token = request.json.get('token')
    eatery_id = Eatery.decode_auth_token(token)
    if not isinstance(eatery_id, int):
        return jsonify({"message": eatery_id}), 400 # It means an error message is returned

    eatery = Eatery.query.get(eatery_id)
    data = request.get_json()
    eatery.restaurant_name = data.get('restaurant_name', eatery.restaurant_name)
    eatery.location = data.get('location', eatery.location)
    eatery.email = data.get('email', eatery.email)

    if 'password' in data:
        eatery.hash_password(data.get('password'))

    db.session.commit()
    return jsonify({"message": "Eatery updated"}), 200

@token_required
@user.route('/eatery/profile/', methods=['GET'])
def get_eatery():
    token = request.args['token']
    eatery_id = Eatery.decode_auth_token(token)
    if not isinstance(eatery_id, int):
        return jsonify({"message": eatery_id}), 400 # It means an error message is returned

    eatery = Eatery.query.get(eatery_id)
    eatery_data = {
        'id': eatery.id,
        'restaurant_name': eatery.restaurant_name,
        'location': eatery.location,
        'email': eatery.email,
        'cuisine': eatery.cuisine
    }

    return jsonify(eatery_data)