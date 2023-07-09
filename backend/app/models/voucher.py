from app.extensions import db

class Voucher(db.Model):
    __tablename__ = 'voucher'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text)
    eatery = db.Column(db.Integer, db.ForeignKey('eatery.id'))
    expiry = db.Column(db.DateTime)
    amount = db.Column(db.Float) # New field for amount or percentage of discount
    conditions = db.Column(db.Text) # New field for conditions of use
