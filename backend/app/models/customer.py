from app.extensions import db
from app.models.user import User

class Customer(User):
    __tablename__ = 'customer'
    name = db.Column(db.String(50))
    handle = db.Column(db.String(50), unique=True)
    profile_pic = db.Column(db.String(500))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.role = 'customer'
