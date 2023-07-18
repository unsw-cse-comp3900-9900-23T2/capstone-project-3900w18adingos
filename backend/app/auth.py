from flask import Blueprint, jsonify, request
from flask_login import current_user, logout_user, login_required

from app import auth_helper
from app.auth_helper import validate_google_auth_token_and_send_back_token

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
    
@auth.route('/auth/logout')
@login_required
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


@auth.route('/auth/forgotpassword/request', methods=['POST'])
def forgotpasswordreset_request():
    email = request.json.get('email')
    role = request.json.get('role')
    if role not in ['customer', 'eatery']:
        return jsonify({"message": "Invalid role"}), 400
    result = auth_helper.auth_passwordreset_request(email, role)
    return result

@auth.route('/auth/passwordreset/reset/', methods=['POST'])
def passwordreset_reset():
    reset_code = request.json.get('resetCode')
    new_password = request.json.get('newPassword')
    result = auth_helper.auth_passwordreset_reset(reset_code, new_password)
    return result
    
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
@login_required
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

@auth.route('/auth/validate-google-token', methods=['POST'])
def validate_google_token():
    code = request.json.get('code')
    return validate_google_auth_token_and_send_back_token(code)

