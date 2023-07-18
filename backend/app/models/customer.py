from werkzeug.security import generate_password_hash

from app.extensions import db
from app.models.user import User

class Customer(User):
    __tablename__ = 'customer'
    
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    name = db.Column(db.String(50))
    # cuisine_preferences = db.relationship('LikesCuisine', backref='customer')
    # profile_pic = db.Column(db.String(120), default='default.jpg')

    __mapper_args__ = {
        'polymorphic_identity':'customer'
    }

    def __init__(self, **kwargs):
        password = kwargs.pop('password', None)
        super(Customer, self).__init__(**kwargs)
        if password:
            self.password_hash = generate_password_hash(password)
