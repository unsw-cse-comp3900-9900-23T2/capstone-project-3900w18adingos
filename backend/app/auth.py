from flask import Blueprint, request, jsonify, g
from app import auth_helper
from .models.customer import Customer
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

@auth.route('/auth/me', methods=['GET'])
def me():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Missing token"}), 400

    token = token.split(" ")[1]  # The Authorization header format is "Bearer <token>"
    user = Customer.verify_auth_token(token)
    if not user:
        return jsonify({"message": "Invalid token"}), 401  # unauthorized

    # return the user's data
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "handle": user.handle,
        "profile_pic": user.profile_pic,
        # add any other fields you want to return here
    }), 200