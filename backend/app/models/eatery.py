from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask_login import UserMixin
import math
from sqlalchemy import func
from sqlalchemy.ext.hybrid import hybrid_method
from marshmallow import fields

from app.extensions import db, ma
from app.models.review import ReviewSchema
from app.models.image import ImageSchema
from app.models.cooks_cuisine import CooksCuisineSchema

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

    def __init__(self, longitude, latitude, location, password, **kwargs):
        super(Eatery, self).__init__(**kwargs)
        self.longitude = longitude
        self.latitude = latitude
        self.location = location
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
        return data['id'] if data['role'] == 'eatery' else None

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @hybrid_method
    def distance(self, user_lat, user_long, max_distance):
        earth_radius = 6371  # Radius of the Earth in kilometers

        print(self.latitude)
        # Convert latitude and longitude to radians
        lat1_rad = math.radians(self.latitude)
        lon1_rad = math.radians(self.longitude)
        lat2_rad = math.radians(user_lat)
        lon2_rad = math.radians(user_long)

        # Calculate the differences between the latitudes and longitudes
        delta_lat = lat2_rad - lat1_rad
        delta_lon = lon2_rad - lon1_rad

        # Calculate the Haversine formula
        a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = earth_radius * c

        return distance <= max_distance
    
    @distance.expression
    def distance(cls, user_lat, user_long, max_distance):
        earth_radius = 6371  # Radius of the Earth in kilometers
        
        print(cls.latitude)
        # Convert latitude and longitude to radians
        lat1_rad = func.radians(cls.latitude)
        lon1_rad = func.radians(cls.longitude)
        lat2_rad = func.radians(user_lat)
        lon2_rad = func.radians(user_long)

        # Calculate the differences between the latitudes and longitudes
        delta_lat = lat2_rad - lat1_rad
        delta_lon = lon2_rad - lon1_rad

        # Calculate the Haversine formula
        a = func.pow(func.sin(delta_lat / 2), 2) + func.cos(lat1_rad) * func.cos(lat2_rad) * func.pow(func.sin(delta_lon / 2), 2)
        c = 2 * func.atan2(func.sqrt(a), func.sqrt(1 - a))
        distance = earth_radius * c

        return distance <= max_distance

class EaterySchema(ma.SQLAlchemySchema):
    class Meta:
        model = Eatery
    
    id = ma.auto_field()
    email = ma.auto_field()
    password_hash = ma.auto_field()
    restaurant_name = ma.auto_field()
    location = ma.auto_field()
    role = ma.auto_field()
    latitude = ma.auto_field()
    longitude = ma.auto_field()
    reviews = fields.Nested(ReviewSchema, many=True)
    eatery_image = fields.Nested(ImageSchema, many=True)
    cuisines = fields.Nested(CooksCuisineSchema, many=True)

eatery_schema = EaterySchema()
eatery_schema_list = EaterySchema(many=True)
