from app.extensions import db

class Review(db.Model):
    __tablename__ = 'review'
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    review_text = db.Column(db.Text)
    customer_id = db.Column(db.Integer(), db.ForeignKey('customer.id'))
    eatery_id = db.Column(db.Integer(), db.ForeignKey('eatery.id'))

    def __repr__(self):
        return f'<Review for eatery "{self.eatery_id}" by customer "{self.customer_id}", "{self.review_text}">'