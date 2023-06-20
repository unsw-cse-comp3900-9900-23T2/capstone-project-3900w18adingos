from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define your models here

@app.route('/api/greeting', methods=['GET'])
def get_greeting():
    return jsonify({'greeting': 'Hello, World!'})

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Flask backend!"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
