# models/customer.py
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import current_app
from app.database import db
from flask_login import UserMixin

class Customer(db.Model, UserMixin):
    __tablename__ = 'customer'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(128))
    password_hash = db.Column(db.String(128))
    handle = db.Column(db.String(50), unique=True)
    profile_pic = db.Column(db.String(500))
   # role = db.Column(db.String(50), default='customer')

    # additional fields for Customer...
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.role = 'customer'

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_auth_token(self, expiration=600):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        return s.dumps({'id': self.id}, salt='auth')

    @staticmethod
    def verify_auth_token(token):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token, salt='auth')
        except (SignatureExpired, BadSignature):
            return None  # invalid token
        user = Customer.query.get(data['id'])
        return user
    # @property
    # def role(self):
    #     return 'customer'
