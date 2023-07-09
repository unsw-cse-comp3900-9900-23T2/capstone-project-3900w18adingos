from flask import Blueprint, request, jsonify
from flask_login import current_user, logout_user
from app import auth_helper
from app.models.customer import Customer

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
    
@auth.route('/auth/logout')
def logout_get():
    if current_user and current_user.is_authenticated:
        logout_user()

    return jsonify(success=True), 200

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
    user_id_or_error = Customer.decode_auth_token(token)
    if isinstance(user_id_or_error, str):  # an error message was returned
        return jsonify({"message": user_id_or_error}), 401  # unauthorized

    user = Customer.query.get(user_id_or_error)
    if not user:
        return jsonify({"message": "User not found"}), 401

    # return the user's data
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        # add any other fields you want to return here
    }), 200
    
@auth.route('/auth/whoami', methods=['GET'])
def whoami():
    if not current_user or not current_user.is_authenticated:
        return jsonify({"message": "Not logged in"}), 401

    # return the user's data
    return jsonify({
        "id": current_user.id,
        "email": current_user.email,
    }), 200
    
@auth.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = Customer.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # return the user's data
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        # add any other fields you want to return here
    }), 200