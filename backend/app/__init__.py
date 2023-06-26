from flask import Flask
from flask_cors import CORS

from .database import db
from .mail import init_mail
from .config import config

from app.models.has_voucher import HasVoucher
from app.models.voucher import Voucher
from app.models.eatery import Eatery
from app.models.customer import Customer
from app.models.cuisine import Cuisine

def create_app(config_name='default'):

    app = Flask(__name__)
    CORS(app) 

    app.config.from_object(config[config_name])

    db.init_app(app)
    init_mail(app)

    with app.app_context():
        db.create_all()

        from app.main import main as main_blueprint
        app.register_blueprint(main_blueprint)

        from app.auth import auth as auth_blueprint
        app.register_blueprint(auth_blueprint)

        from app.search import search_bp as search_blueprint
        app.register_blueprint(search_blueprint)
    
    return app
