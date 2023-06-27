from flask import Flask
from flask_cors import CORS
from .database import db
from .mail import init_mail
from .config import config

from app.models.has_voucher import HasVoucher
from app.models.voucher import Voucher
from app.models.eatery import Eatery
from app.models.customer import Customer
from app.models.review import Review
from app.models.image import Image

def create_app(config_name='default'):

    app = Flask(__name__)

    app.config.from_object(config[config_name])
    CORS(app, origins=['http://localhost:5173'])
    db.init_app(app)
    init_mail(app)

    with app.app_context():
        db.create_all()

        from app.main import main as main_blueprint
        app.register_blueprint(main_blueprint)

        from app.auth import auth as auth_blueprint
        app.register_blueprint(auth_blueprint)

        from app.user import user as user_blueprint
        app.register_blueprint(user_blueprint)
    
        from app.eatery import eatery as eatery_blueprint
        app.register_blueprint(eatery_blueprint)

        from app.review import review as review_blueprint
        app.register_blueprint(review_blueprint)
    
    return app
