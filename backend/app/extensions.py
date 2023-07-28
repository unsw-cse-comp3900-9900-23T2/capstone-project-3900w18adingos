from flask_sqlalchemy import SQLAlchemy
from flask_praetorian import Praetorian
from flask_marshmallow import Marshmallow
from flask_mail import Mail

db = SQLAlchemy()
guard = Praetorian()
ma = Marshmallow()

mail = Mail()

def init_mail(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = 'jan.tulip1992@gmail.com'
    app.config['MAIL_PASSWORD'] = 'Wakp9911'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True
    # RESET EMAIL CONFIG
    app.config['PRAETORIAN_RESET_SENDER'] = 'jan.tulip1992@gmail.com'
    app.config['PRAETORIAN_RESET_URI'] = 'http://localhost:5173/auth/reset-password' # Frontend Reset Password Page url
    app.config['PRAETORIAN_RESET_SUBJECT'] = 'Password Reset Request'  
    mail.init_app(app)
