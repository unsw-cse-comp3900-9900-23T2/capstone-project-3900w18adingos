from flask import Blueprint, request, jsonify
from app.models.customer import Customer
from app.models.manager import Manager
from app.auth_helper import *
from app.user_utils import (user_profile_setname_v1,
                            customer_profile_setpic, 
                            manager_profile_set_restaurant_details, 
                            manager_profile_upload_restaurant_pics)


auth = Blueprint('auth', __name__)

@auth.route('/auth/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    role = request.json.get('role')
    if role not in ['customer', 'restaurant']:
        return jsonify({"message": "Invalid role"}), 400
    result = auth.auth_login(email, password)
    return jsonify(result)

@auth.route('/auth/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    name_first = request.json.get('name_first')
    name_last = request.json.get('name_last')
    role = request.json.get('role')
    if role not in ['customer', 'restaurant']:
        return jsonify({"message": "Invalid role"}), 400
    result = auth.auth_register(email, password, name_first, name_last, role)
    return jsonify(result)

@auth.route('/auth/logout', methods=['POST'])
def logout():
    token = request.json.get('token')
    result = auth.auth_logout(token)
    return jsonify(result)

@auth.route('/auth/passwordreset/request', methods=['POST'])
def passwordreset_request():
    email = request.json.get('email')
    return auth.auth_passwordreset_request(email)

@auth.route('/auth/passwordreset/reset', methods=['POST'])
def passwordreset_reset():
    reset_code = request.json.get('reset_code')
    new_password = request.json.get('new_password')
    return auth.auth_passwordreset_reset(reset_code, new_password)
