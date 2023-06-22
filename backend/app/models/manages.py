from app.database import db

class Manages(db.Model):
    __tablename__ = 'manages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    eatery_id = db.Column(db.Integer(), db.ForeignKey('eatery.id'))
