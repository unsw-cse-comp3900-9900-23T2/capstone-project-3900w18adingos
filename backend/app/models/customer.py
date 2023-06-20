from app import db

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    password_hash = db.Column(db.Text)
    name = db.Column(db.Text)

    def __repr__(self):
        return f'<Customer id={self.id}>'
