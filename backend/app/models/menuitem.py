from app.database import db

class MenuItem(db.Model):
    __tablename__ = 'menu_item'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Text()
    description = db.Text()
    price = db.Float()
    eatery_id = db.Column(db.Integer(), db.ForeignKey('eatery.id'))

