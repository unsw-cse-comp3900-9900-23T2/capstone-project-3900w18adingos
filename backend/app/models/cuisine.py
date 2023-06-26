from app.database import db

class Cuisine(db.Model):
    __tablename__ = 'cuisine'
    id = db.Column(db.Integer, primary_key=True)
    cuisine_name = db.Column(db.Text)
    eatery_id = db.Column(db.Integer, db.ForeignKey('eatery.id'))
    