from flask import Blueprint, request, jsonify
from app import auth_helper

auth = Blueprint('auth', __name__)


def check_role(role):
    if role not in ['customer', 'eatery']:
        return False
    return True


@auth.route('/auth/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    role = request.json.get('role')

    if not check_role(role):
        return jsonify({"message": "Invalid role"}), 400

    result = auth_helper.auth_login(email, password, role)
    return result


@auth.route('/auth/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    name = request.json.get('name')
    role = request.json.get('role')
    if role not in ['customer', 'eatery']:
        return jsonify({"message": "Invalid role"}), 400
    result = auth_helper.auth_register(email, password, name, role)
    return result


@auth.route('/auth/logout', methods=['POST'])
def logout():
    token = request.json.get('token')
    result = auth_helper.auth_logout(token)
    return result


@auth.route('/auth/passwordreset/request', methods=['POST'])
def passwordreset_request():
    email = request.json.get('email')
    role = request.json.get('role')
    if not check_role(role):
        return jsonify({"message": "Invalid role"}), 400

    result = auth_helper.auth_passwordreset_request(email, role)
    return result


@auth.route('/auth/passwordreset/reset/', methods=['POST'])
def passwordreset_reset():
    reset_code = request.json.get('reset_code')
    new_password = request.json.get('new_password')
    result = auth_helper.auth_passwordreset_reset(reset_code, new_password)
    return result
