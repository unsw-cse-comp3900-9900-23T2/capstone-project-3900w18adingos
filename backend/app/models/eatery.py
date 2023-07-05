from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from app.extensions import db, login_manager
from flask_login import UserMixin
import datetime

class Eatery(db.Model, UserMixin):
    __tablename__ = 'eatery'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(128))
    restaurant_name = db.Column(db.String(100))
    # display location to help human users find (e.g. inside quad food court)
    location = db.Column(db.Text)
    role = db.Column(db.String(50), default='eatery')
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    reviews = db.relationship('Review', backref='eatery')
    eatery_image = db.relationship('Image', backref='eatery')
    cuisines = db.relationship('CooksCuisine', backref='eatery')
   # registered_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, restaurant_name, email, password):
        self.restaurant_name = restaurant_name
        self.email = email
        self.password_hash = generate_password_hash(password)
      #  self.registered_on = datetime.datetime.now()
        self.role = 'eatery'

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
        return data['id'] if data['role'] == 'eatery' else None

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
