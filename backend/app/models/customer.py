from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import current_app
from app.extensions import db, login_manager
from .user import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)  # this is now user

class Customer(User):  # inherit from User
    __tablename__ = 'customer'
    name = db.Column(db.String(50))
    handle = db.Column(db.String(50), unique=True)
    profile_pic = db.Column(db.String(500))
    role = db.Column(db.String(50), default='customer')

    # additional fields for Customer...
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.role = 'customer'

    def generate_auth_token(self, expiration=600):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        return s.dumps({'id': self.id, 'role': self.role}, salt='auth')

    @staticmethod
    def verify_auth_token(token):
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token, salt='auth')
        except (SignatureExpired, BadSignature):
            return None  # invalid token
        if data['role'] == 'customer':
            user = Customer.query.get(data['id'])
        else:
            return None  # invalid token role
        return user
