from app.database import db

class Eatery(db.Model):
    __tablename__ = 'eatery'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    location = db.Column(db.Text)
