from flask import jsonify, current_app
from flask import url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from app.database import db
from app.models.customer import Customer
from app.models.eatery import Eatery

mail = Mail(current_app)


def get_user_model(role):
    if role == 'customer':
        return Customer
    elif role == 'eatery':
        return Eatery
    else:
        return None


def auth_logout(token):
    token_ = Customer.verify_auth_token(token)
    if not token_:
        token_ = Eatery.verify_auth_token(token)

    if not token_:
        return jsonify({"message": "Invalid token"}), 400
    return jsonify({'message': 'Logged out successfully'}), 200


def auth_login(email, password, role):
    UserModel = get_user_model(role)
    if not UserModel:
        return jsonify({"message": "Invalid role"}), 400

    user = UserModel.query.filter_by(email=email).first()
    if not user or not user.verify_password(password):
        return jsonify({"message": "Invalid credentials"}), 400

    return jsonify(
        {'token': user.generate_auth_token(), 'user': user.name if role == 'customer' else user.restaurant_name,
         'role': role})


def auth_register(email, password, name, role):
    UserModel = get_user_model(role)
    if not UserModel:
        return jsonify({"message": "Invalid role"}), 400

    if UserModel.query.filter_by(email=email).first() is not None:
        return jsonify({"message": f"{role.title()} with that email already exists"}), 400

    user = UserModel(email=email)
    if role == 'customer':
        user.name = name
    elif role == 'eatery':
        user.restaurant_name = name

    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'token': user.generate_auth_token(), 'user': name, 'role': role})


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
