from app.database import db

class Voucher(db.Model):
    __tablename__ = 'voucher'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text)
    eatery = db.Column(db.Integer, db.ForeignKey('eatery.id'))
    expiry = db.Column(db.DateTime)