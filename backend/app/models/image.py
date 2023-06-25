from app.database import db

class Image(db.Model):
    __tablename__ = 'eatery'
    id = db.Column(db.Integer, primary_key=True)
    filepath = db.Text()
    eatery_id = db.Column(db.Integer(), db.ForeignKey('eatery.id'))

