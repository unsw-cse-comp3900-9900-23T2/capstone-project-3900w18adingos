from flask import Blueprint
from app.models.customer import Customer

main = Blueprint('main', __name__)

@main.route('/', methods=['GET'])
def home():
    tmp = Customer.query.all()[0].name
    return f"Welcome to the Flask backend! {tmp}"