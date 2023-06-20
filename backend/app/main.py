from flask import Blueprint

from app import db

main = Blueprint('main', __name__)

@main.route('/', methods=['GET'])
def home():
    return "Welcome to the Flask backend!"