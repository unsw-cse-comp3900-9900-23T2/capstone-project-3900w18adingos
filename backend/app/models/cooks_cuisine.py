from app.extensions import db

class CooksCuisine(db.Model):
    __tablename__ = 'cooks_cuisine'
    id = db.Column(db.Integer, primary_key=True)
    eatery_id = db.Column(db.Integer, db.ForeignKey('eatery.id'))
    cuisine_id = db.Column(db.Integer, db.ForeignKey('cuisine.id'))
    cuisine = db.relationship('Cuisine')