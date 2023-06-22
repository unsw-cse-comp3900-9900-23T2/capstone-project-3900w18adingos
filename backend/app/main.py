from flask import Blueprint, request, jsonify
from app.models.customer import Customer
from app.models.manager import Manager
from app import auth


main = Blueprint('main', __name__)

@main.route('/', methods=['GET'])
def home():
    tmp = Customer.query.all()[0].name
    return f"Welcome to the Flask backend! {tmp}"


@main.route('/auth/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    role = request.json.get('role')
    if role not in ['customer', 'restaurant']:
        return jsonify({"message": "Invalid role"}), 400
    result = auth.auth_login(email, password)
    return jsonify(result)

@main.route('/auth/register', methods=['POST'])
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

@main.route('/auth/logout', methods=['POST'])
def logout():
    token = request.json.get('token')
    result = auth.auth_logout(token)
    return jsonify(result)

@main.route('/auth/passwordreset/request', methods=['POST'])
def passwordreset_request():
    email = request.json.get('email')
    return auth.auth_passwordreset_request(email)

@main.route('/auth/passwordreset/reset', methods=['POST'])
def passwordreset_reset():
    reset_code = request.json.get('reset_code')
    new_password = request.json.get('new_password')
    return auth.auth_passwordreset_reset(reset_code, new_password)


# @main.route('/user/profile/uploadphoto', methods=['POST'])
# def user_profile_uploadphoto():
#     token = request.json.get('token')
#     img_url = request.json.get('img_url')
#     x_start = request.json.get('x_start')
#     y_start = request.json.get('y_start')
#     x_end = request.json.get('x_end')
#     y_end = request.json.get('y_end')
#     result = Customer.user_profile_uploadphoto(token, img_url, x_start, y_start, x_end, y_end)
#     return jsonify(result)

# @main.route('/user/profile', methods=['GET'])
# def get_user_profile():
#     token = request.json.get('token')
#     return user.get_user_profile(token)

# @main.route('/user/profile', methods=['PUT'])
# def update_user_profile():
#     token = request.json.get('token')
#     name = request.json.get('name')
#     return user.update_user_profile(token, name)
