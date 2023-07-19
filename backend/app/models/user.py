from flask import current_app
from itsdangerous import URLSafeTimedSerializer
from flask_login import UserMixin
from werkzeug.security import generate_password_hash

from app.extensions import db, login_manager

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    type = db.Column(db.String(20))
    
    __mapper_args__ = {
        'polymorphic_identity':'user',
        'polymorphic_on':type
    }

    def encode_auth_token(self, user_id, role):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        return s.dumps({'id': self.id, 'role': role}, salt='auth')

    # @staticmethod
    # def decode_auth_token(token):
    #     s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    #     try:
    #         data = s.loads(token, salt='auth')
    #     except (SignatureExpired, BadSignature):
    #         return "Token invalid or expired. Please log in again."
    #     return {'id': data['id'], 'role': data['role']} if data['role'] == 'eatery' else None

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    # def verify_password(self, password):
    #     return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.email)
