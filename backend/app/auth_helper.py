from flask import jsonify, current_app, session
from flask_mail import Mail, Message
from flask_login import login_user, logout_user, current_user
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from werkzeug.security import check_password_hash
import requests

from app.extensions import db
from app.models.user import User
from app.models.customer import Customer
from app.models.eatery import Eatery

mail = Mail(current_app)

# def auth_logout(token):
#     user_id_or_error = Customer.decode_auth_token(token)
#     if isinstance(user_id_or_error, str):  # an error message was returned
#         user_id_or_error = Eatery.decode_auth_token(token)
#     if isinstance(user_id_or_error, str):  # an error message was returned
#         return jsonify({"message": user_id_or_error}), 400

#     logout_user()
#     return jsonify({'message': 'Logged out successfully'}), 200

def auth_login(email, password, role):
   
    user = User.query.filter_by(email=email).first_or_404()
    
    if not check_password_hash(user.password_hash, password):
        return jsonify(success=False), 401
    
    login_user(user, remember=True)
    
    role='eatery'
    if isinstance(user, Customer):
        role='customer'
    
    return jsonify(
        {
            'user': user.name if role == 'customer' else user.restaurant_name,
            'role': role
        }
    )

def auth_register(email, password, name, role):
    
    if role not in ['customer', 'eatery']:
        return jsonify({"message": "Invalid role"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "user with that email already exists"}), 400

    if role == 'customer':
        user = Customer(email=email, name=name, password=password)
    elif role == 'eatery':
        user = Eatery(email=email, restaurant_name=name, password=password)

    db.session.add(user)
    db.session.commit()

    login_user(user, remember=True)

    return jsonify({'user': name, 'role': role})

def auth_passwordreset_reset(token, password):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token, salt='password-reset-key', max_age=3600)
    except SignatureExpired:
        return jsonify({"message": "Token expired"}), 400
    except BadSignature:
        return jsonify({"message": "Invalid token"}), 400

    role = data['role']
    
    if role not in ['customer', 'eatery']:
        return jsonify({"message": "Invalid role"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"message": "This email does not exist"}), 400

    user.hash_password(password)
    db.session.commit()
    return jsonify({'message': 'Password reset successfully'})


def send_reset_email(email, reset_url):
    msg = Message('Password Reset Request', sender='', recipients=[email])
    msg.body = f"Reset your password by clicking on the following link: {reset_url}"
    mail.send(msg)


def auth_passwordreset_request(email, role):
    if role not in ['customer', 'eatery']:
        return jsonify({"message": "Invalid role"}), 400

    if User.query.filter_by(email=email).first() is None:
        return jsonify({"message": "We are not able to find this email address"}), 400

    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = s.dumps({'email': email, 'role': role}, salt='password-reset-key')
    reset_url = 'http://localhost:5173/auth/reset-password/' + str(token) + '/'
    try:
        send_reset_email(email, reset_url)
    except Exception as e:
        pass
    print(reset_url)
    return jsonify({'message': 'Check your email for the instructions to reset your password'})


def validate_google_auth_token_and_send_back_token(code, role):
    client_id = '397558360733-au1inv2shr9v7cqdrkghl31t5pfh9qfp.apps.googleusercontent.com'
    client_secret = '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'
    redirect_uri = 'http://localhost:5173'

    token_url = 'https://oauth2.googleapis.com/token'
    token_payload = {
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }

    response = requests.post(token_url, data=token_payload)
    response_json = response.json()

    if 'access_token' in response_json:
        access_token = response_json['access_token']
        userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(userinfo_url, headers=headers)
        userinfo_json = response.json()

        if 'email' in userinfo_json and 'name' in userinfo_json:
            email = userinfo_json['email'].lower().strip()
            name = userinfo_json['name']

            user = User.query.filter_by(email=email).first()
            if user:
                role = 'customer' if isinstance(user, Customer) else 'eatery'
                return jsonify({'token': user.encode_auth_token(user.id, "Customer"), 'user': name, 'role': role})

            if role == 'customer':
                user = Customer(email=email, name=name, auth_source='google')
            else: # role == 'eatery'
                user = Eatery(email=email, restaurant_name=name, auth_source='google')

            db.session.add(user)
            db.session.commit()
            login_user(user, remember=True)
            return jsonify({'token': user.encode_auth_token(user.id, "Customer"), 'user': name, 'role': role})

    return jsonify({"message": "Failed to validate token"}), 400
