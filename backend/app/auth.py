from flask import Blueprint, jsonify, request
from flask_praetorian import current_user, auth_required

from app import auth_helper
from app.auth_helper import validate_google_auth_token_and_send_back_token
from app.extensions import db, guard

from app.models.customer import Customer, customer_schema
from app.models.eatery import eatery_schema

auth = Blueprint('auth', __name__)


@auth.route('/auth/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    role = request.json.get('role')

    result = auth_helper.auth_login(email, password, role)
    return result


@auth.route('/auth/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    name = request.json.get('name')
    role = request.json.get('role')
    
    result = auth_helper.auth_register(email, password, name, role)
    return result
    
@auth.route('/auth/logout')
@auth_required
def logout_get():
    return jsonify(success=True), 200


@auth.route('/auth/passwordreset/request', methods=['POST'])
def passwordreset_request():
    email = request.json.get('email')
    role = request.json.get('role')

    result = auth_helper.auth_passwordreset_request(email, role)
    return result
    
@auth.post('/auth/passwordreset/reset')
def passwordreset_reset():
    req = request.get_json(force=True)
    
    reset_token = req.get("Token")
    
    user = guard.validate_reset_token(reset_token)
    if user is None:
        return jsonify("Invalid token in reset URL. Please renew your password reset request."), 400
        
    new_pwd = req.get("new_password", None)
    if new_pwd is None:
        return jsonify("No password specified"), 400
    user.password = guard.hash_password(new_pwd)
    db.session.commit()
    return jsonify("Password reset successful. You may now log in."), 200



@auth.route('/auth/forgotpassword/request', methods=['POST'])
def forgotpasswordreset_request():
    email = request.json.get('email')
    role = request.json.get('role')
    if role not in ['customer', 'eatery']:
        return jsonify({"message": "Invalid role"}), 400
    result = auth_helper.auth_passwordreset_request(email, role)
    return result

@auth.route('/auth/whoami', methods=['GET'])
@auth_required
def whoami():
    if not current_user():
        return jsonify({"message": "Not logged in"}), 401

    return customer_schema.dump(current_user()) if isinstance(current_user(), Customer) else eatery_schema.dump(current_user()), 200

@auth.route('/auth/validate-google-token', methods=['POST'])
def validate_google_token():
    code = request.json.get('code')
    role = 'customer'  # Set role as 'customer' by default
    return validate_google_auth_token_and_send_back_token(code, role)


