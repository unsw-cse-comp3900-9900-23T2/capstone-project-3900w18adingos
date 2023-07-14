from app.extensions import db

class HasVoucher(db.Model):
    __tablename__ = 'has_voucher'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer(), db.ForeignKey('customer.id'))
    voucher_id = db.Column(db.Integer(), db.ForeignKey('voucher.id'))
