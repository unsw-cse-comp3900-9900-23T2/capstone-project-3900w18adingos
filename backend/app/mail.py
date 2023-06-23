from flask_mail import Mail

mail = Mail()

def init_mail(app):
    app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'your-email@gmail.com'
    app.config['MAIL_DEFAULT_SENDER'] = 'your-email@gmail.com'
    app.config['MAIL_PASSWORD'] = 'password'
    mail.init_app(app)
