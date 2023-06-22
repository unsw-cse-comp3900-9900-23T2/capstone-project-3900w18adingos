from flask import Flask, jsonify
from flask_cors import CORS

from app.models.customer import Customer
from app.models.manager import Manager

from .database import db
from .auth import auth_blueprint
from .mail import init_mail



def create_app():

    app = Flask(__name__)
    CORS(app) 

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    init_mail(app)

    with app.app_context():
        db.create_all()

        from app.main import main as main_blueprint
        app.register_blueprint(main_blueprint)

        from app.auth import auth as auth_blueprint
        app.register_blueprint(auth_blueprint)
    
    return app
