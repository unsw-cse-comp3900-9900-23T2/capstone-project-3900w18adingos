from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import render_template, jsonify, url_for, current_app
from flask_mail import Message

# from .mail import mail
from app.database import db
from app.models.customer import Customer
from app.models.eatery import Eatery


def get_user_model(role):
    if role == 'customer':
        return Customer
    elif role == 'eatery':
        return Eatery
    else:
        return None

def auth_login(email, password, role):
    UserModel = get_user_model(role)
    if not UserModel:
        return jsonify({"message": "Invalid role"}), 400

    user = UserModel.query.filter_by(email=email).first()
    if not user or not user.verify_password(password):
        return jsonify({"message": "Invalid credentials"}), 400

    return jsonify({'token': user.generate_auth_token(), 'user': user.name if role == 'customer' else user.restaurant_name, 'role': role})

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
    return jsonify({'token': user.generate_auth_token(), 'user': name, 'role': role, 'message': 'Registration successful'})

def auth_logout(token, role):
    UserModel = get_user_model(role)
    if not UserModel:
        return jsonify({"message": "Invalid role"}), 400

    user = UserModel.verify_auth_token(token)
    if not user:
        return jsonify({"message": "Invalid token"}), 400

    # Invalidate the token depends on how we implement db
    return jsonify({'message': 'Logged out successfully'})

def auth_passwordreset_reset(token, password, role):
    UserModel = get_user_model(role)
    if not UserModel:
        return jsonify({"message": "Invalid role"}), 400

    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt='password-reset-key', max_age=3600)
    except SignatureExpired:
        return jsonify({"message": "Token expired"}), 400
    except BadSignature:
        return jsonify({"message": "Invalid token"}), 400

    user = UserModel.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": f"{role.title()} with that email does not exist"}), 400

    user.hash_password(password)
    db.session.commit()
    return jsonify({'message': 'Password reset successfully'})

# def auth_login(email, password):
#     user = Customer.query.filter_by(email=email).first()
#     if not user or not user.verify_password(password):
#         return jsonify({"message": "Invalid credentials"}), 400

#     return jsonify({'token': user.generate_auth_token(), 'user': user.name, 'role': user.role})

# def auth_register(email, password, name, role):
#     if Customer.query.filter_by(email=email).first() is not None:
#         return jsonify({"message": "Customer with that email already exists"}), 400
#     user = Customer(name=name, email=email, role=role)
#     user.hash_password(password)
#     db.session.add(user)
#     db.session.commit()
#     return jsonify({'token': user.generate_auth_token(), 'user': user.name, 'role': user.role})

# def send_async_email(app, msg):
#     with app.app_context():
#         mail.send(msg)

# # def send_email(to, subject, template):
# #     msg = Message(subject, recipients=[to])
# #     msg.body = template
# #     thr = Thread(target=send_async_email, args=[app, msg])
# #     thr.start()
# #     return thr

# def auth_logout(token):
#     user = Customer.verify_auth_token(token)
#     if not user:
#         return jsonify({"message": "Invalid token"}), 400

#     # Invalidate the token depends on how we implement db
#     return jsonify({'message': 'Logged out successfully'})

# # def auth_passwordreset_request(email):
# #     user = Customer.query.filter_by(email=email).first()
# #     if not user:
# #         return jsonify({"message": "Customer with that email does not exist"}), 400
# #     # Generate a reset token
# #     s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
# #     token = s.dumps(email, salt='password-reset-key')

# #     # Send an email to the user with the token
# #     reset_url = url_for('auth_reset_with_token', token=token, _external=True)
# #     html = render_template('reset_password.html', reset_url=reset_url)
# #     send_email(user.email, 'Password Reset Requested', html)

# #     return jsonify({'token': token, 'message': 'Check your email for the instructions to reset your password'})

# def auth_passwordreset_reset(token, password):
#     s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
#     try:
#         email = s.loads(token, salt='password-reset-key', max_age=3600)
#     except SignatureExpired:
#         return jsonify({"message": "Token expired"}), 400
#     except BadSignature:
#         return jsonify({"message": "Invalid token"}), 400

#     user = Customer.query.filter_by(email=email).first()
#     if not user:
#         return jsonify({"message": "Customer with that email does not exist"}), 400

#     user.hash_password(password)
#     db.session.commit()
#     return jsonify({'message': 'Password reset successfully'})