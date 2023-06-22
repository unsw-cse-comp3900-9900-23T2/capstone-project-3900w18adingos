from flask_login import UserMixin
from app.database import db

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    email = db.Column(db.Text, unique=True)
    password_hash = db.Column(db.Text)
    profile_pic = db.Column(db.Text)
    vouchers = db.relationship('Voucher', secondary='has_voucher')
