from flask import Flask, session
from flask_cors import CORS

from .extensions import db, login_manager
from .mail import init_mail
from .config import config

def create_app(config_name='default'):

    app = Flask(__name__)

    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        user_type = session.get('user_type')
        if user_type == 'customer':
            return Customer.query.get(int(user_id))
        elif user_type == 'eatery':
            return Eatery.query.get(int(user_id))

    app.config.from_object(config[config_name])
    
    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)

    from app.models.has_voucher import HasVoucher
    from app.models.voucher import Voucher
    from app.models.eatery import Eatery
    from app.models.customer import Customer
    from app.models.review import Review
    from app.models.image import Image
    from app.models.cuisine import Cuisine
    from app.models.cooks_cuisine import CooksCuisine

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

        from app.search import search_bp as search_blueprint
        app.register_blueprint(search_blueprint)
    
    return app