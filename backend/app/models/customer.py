from flask import current_app
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from app.extensions import db

class Customer(db.Model, UserMixin):
    __tablename__ = 'customer'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(128))
    #registered_on = db.Column(db.DateTime, nullable=False)
    role = db.Column(db.String(50), default='customer')
    handle = db.Column(db.String(120), unique=True)
    auth_source = db.Column(db.String(20), default='local')
    # cuisine_preferences = db.relationship('LikesCuisine', backref='customer')
    # profile_pic = db.Column(db.String(120), default='default.jpg')

    def __init__(self, **kwargs):
        password = kwargs.pop('password', None)
        super(Customer, self).__init__(**kwargs)
        if password:
            self.password_hash = generate_password_hash(password)

    def encode_auth_token(self, user_id):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        return s.dumps({'id': self.id, 'role': self.role}, salt='auth')

    @staticmethod
    def decode_auth_token(token):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token, salt='auth')
        except (SignatureExpired, BadSignature):
            return "Token invalid or expired. Please log in again."
        return {'id': data['id'], 'role': data['role']} if data['role'] == 'customer' else None


    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
