from flask import Blueprint, request, jsonify
from app.models.customer import Customer
from app.models.eatery import Eatery
from app.database import db


user = Blueprint('user', __name__)


@user.route('/', methods=['GET'])
def home():
    return f"Welcome to the Flask backend!"


@user.route('/customer/profile/', methods=['GET'])
def get_customer():
    token = request.args['token']
    customer = Customer.verify_auth_token(token)
    if not customer:
        return jsonify({"message": "Token is invalid"}), 400

    customer_data = {
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'password': customer.password,
        'password_hash': customer.password_hash,
        'handle': customer.handle,
        'profile_pic': customer.profile_pic
    }

    return jsonify(customer_data)


@user.route('/customer/edit-profile/', methods=['PUT'])
def edit_customer():
    token = request.json.get('token')
    customer = Customer.verify_auth_token(token)
    if not customer:
        return jsonify({"message": "Token is invalid"}), 400

    data = request.get_json()
    customer.name = data.get('name', customer.name)
    customer.email = data.get('email', customer.email)

    if 'password' in data:
        customer.password = data.get('password', customer.password)
        customer.hash_password(data.get('password'))
    customer.handle = data.get('handle', customer.handle)
    customer.profile_pic = data.get('profile_pic', customer.profile_pic)

    db.session.commit()
    return jsonify({"message": "Customer updated"}), 200


@user.route('/eatery/edit-profile/', methods=['PUT'])
def edit_eatery():
    token = request.json.get('token')
    eatery = Eatery.verify_auth_token(token)
    if not eatery:
        return jsonify({"message": "Token is invalid"}), 400

    data = request.get_json()
    eatery.restaurant_name = data.get('restaurant_name', eatery.restaurant_name)
    eatery.location = data.get('location', eatery.location)
    eatery.email = data.get('email', eatery.email)

    if 'password' in data:
        eatery.password = data.get('password', eatery.password)
        eatery.hash_password(data.get('password'))

    db.session.commit()
    return jsonify({"message": "Eatry updated"}), 200


@user.route('/eatery/profile/', methods=['GET'])
def get_eatery():
    token = request.args['token']
    eatery = Eatery.verify_auth_token(token)
    if not eatery:
        return jsonify({"message": "Token is invalid"}), 400

    eatery_data = {
        'id': eatery.id,
        'restaurant_name': eatery.restaurant_name,
        'location': eatery.location,
        'email': eatery.email,
        'cuisine': eatery.cuisine
    }

    return jsonify(eatery_data)