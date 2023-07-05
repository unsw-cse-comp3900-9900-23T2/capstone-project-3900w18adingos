from flask import jsonify, current_app, url_for, session
from flask_mail import Mail, Message
from flask_login import login_user, logout_user, login_required, current_user
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from app.extensions import db
from app.models.customer import Customer
from app.models.eatery import Eatery

mail = Mail(current_app)

def user_is_eatery():
    if not current_user.is_authenticated:
        return False
    return isinstance(current_user._get_current_object(), Eatery)

def get_user_model(role):
    if role == 'customer':
        return Customer
    elif role == 'eatery':
        return Eatery
    else:
        return None


def auth_logout(token):
    user_id_or_error = Customer.decode_auth_token(token)
    if isinstance(user_id_or_error, str):  # an error message was returned
        user_id_or_error = Eatery.decode_auth_token(token)
    if isinstance(user_id_or_error, str):  # an error message was returned
        return jsonify({"message": user_id_or_error}), 400

    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


def auth_login(email, password, role):
    if not email or not password or not role:
        print('Missing email, password, or role')
        return jsonify({"message": "Missing email, password, or role"}), 400

    UserModel = get_user_model(role)
    if not UserModel:
        print(f'Invalid role: {role}')
        return jsonify({"message": "Invalid role"}), 400

    user = UserModel.query.filter_by(email=email).first()
    if not user:
        print(f'No user found with email: {email}')
        return jsonify({"message": "Invalid credentials"}), 400

    if not user.verify_password(password):
        print('Invalid password')
        return jsonify({"message": "Invalid credentials"}), 400

    login_user(user, remember=True)
    session['user_type'] = role

    return jsonify(
        {
            'token': user.encode_auth_token(user.id).decode(), 
            'user': user.name if role == 'customer' else user.restaurant_name,
            'role': role
        }
    )

def auth_register(email, password, name, role):
    UserModel = get_user_model(role)
    if not UserModel:
        return jsonify({"message": "Invalid role"}), 400

    if UserModel.query.filter_by(email=email).first() is not None:
        return jsonify({"message": f"{role.title()} with that email already exists"}), 400

    if role == 'customer':
        user = UserModel(email=email, name=name, password=password)
    elif role == 'eatery':
        user = UserModel(email=email, restaurant_name=name, password=password)

    user.hash_password(password)
    db.session.add(user)
    db.session.commit()

    login_user(user, remember=True)
    session['user_type'] = role  # add this line

    return jsonify({'token': user.encode_auth_token(user.id), 'user': name, 'role': role})

def auth_passwordreset_reset(token, password):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token, salt='password-reset-key', max_age=3600)
    except SignatureExpired:
        return jsonify({"message": "Token expired"}), 400
    except BadSignature:
        return jsonify({"message": "Invalid token"}), 400

    role = data['role']
    UserModel = get_user_model(role)
    if not UserModel:
        return jsonify({"message": "Invalid role"}), 400

    user = UserModel.query.filter_by(email=data['email']).first()
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
    UserModel = get_user_model(role)
    if not UserModel:
        return jsonify({"message": "Invalid role"}), 400

    if UserModel.query.filter_by(email=email).first() is None:
        return jsonify({"message": "We are not able to find this email address"}), 400

    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = s.dumps({'email': email, 'role': role}, salt='password-reset-key')
    reset_url = url_for('auth.passwordreset_reset', token=token, _external=True)
    try:
        send_reset_email(email, reset_url)
    except Exception as e:
        pass
    print(reset_url)
    return jsonify({'token': token, 'message': 'Check your email for the instructions to reset your password'})