import sys
import os
# Get the current directory of 'test_auth.py'
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get the parent directory (project root)
project_root = os.path.dirname(current_dir)

# Add the project root to sys.path
sys.path.append(project_root)
import unittest
import json  # import json module
from app import create_app, db
from app.models.customer import Customer
from app.models.voucher import Voucher
from app.models.eatery import Eatery
from app.models.cuisine import Cuisine
from werkzeug.security import generate_password_hash
from flask import jsonify


class SearchTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(config_name='testing')
        self.client = self.app.test_client()
        self.customer_data = {
            'email': 'testcustomer@example.com',
            'password': 'test_password',
            'name': 'Test Customer',
            'role': 'customer'
        }
        self.eatery_data = {
            'email': 'testeatery@example.com',
            'password': 'test_password',
            'restaurant_name': 'Test Eatery',
            'role': 'eatery'
        }

        with self.app.app_context():
            # create all tables
            db.create_all()
            #Customer.query.delete()
            #Eatery.query.delete()
            hashed_password = generate_password_hash(self.customer_data['password'], method='sha256')

            test_customer = Customer(email=self.customer_data['email'], password_hash=hashed_password)
            test_customer.name = self.customer_data['name']
            # db.session.add(test_customer)

            hashed_password = generate_password_hash(self.eatery_data['password'], method='sha256')

            # test_eatery = Eatery(email=self.eatery_data['email'], password_hash=hashed_password)
            # test_eatery.restaurant_name = self.eatery_data['restaurant_name']
            # test_eatery.location = "25 john st somewhere idk"
            # db.session.add(test_eatery)

            # db.session.commit()
            db.session.add(Eatery(id = 1,
                                 email=self.eatery_data['email'],
                                 password_hash=hashed_password,
                                 restaurant_name=self.eatery_data['restaurant_name'],
                                 latitude=-33.809020,
                                 longitude=151.015370))
            db.session.add(Eatery(id = 2,
                                 email='mcdonalds@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="McDonald's",
                                 latitude=-33.808164,
                                 longitude=150.987919))
            db.session.add(Eatery(id = 3,
                                 email='joe@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="Joe's Pizza",
                                 latitude=-33.756800,
                                 longitude=150.809836))
            db.session.add(Eatery(id = 4,
                                 email='thai@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="Thai Place",
                                 latitude=-33.759084,
                                 longitude=150.828623))
            db.session.add(Eatery(id = 5,
                                 email='ambatukam@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="Ambatukam's Indian",
                                 latitude=-33.757000,
                                 longitude=150.842918))
            db.session.add(Eatery(id = 6,
                                 email='indian@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="HurryCurry indian",
                                 latitude=-33.745639,
                                 longitude=150.700012))
            
            db.session.add(Cuisine(id=1,
                                   cuisine_name="Chinese",
                                   eatery_id=1))
            db.session.add(Cuisine(id=2,
                                   cuisine_name="American",
                                   eatery_id=2))
            db.session.add(Cuisine(id=3,
                                   cuisine_name="Italian",
                                   eatery_id=3))
            db.session.add(Cuisine(id=4,
                                   cuisine_name="Thai",
                                   eatery_id=4))
            db.session.add(Cuisine(id=5,
                                   cuisine_name="Indian",
                                   eatery_id=5))
            db.session.add(Cuisine(id=6,
                                   cuisine_name="Indian",
                                   eatery_id=6))

            db.session.commit()
    
    # def test_search_name(self):
    #     res = self.client.post('/auth/register', json=self.customer_data)
    #     data = json.loads(res.data.decode())
    #     token = data['token']
    #     body = {
    #         'search_term': 'thai',
    #         'token': token,
    #         'qty': 1
    #     }
    #     res = self.client.post('/search', json=body)
    #     data = json.loads(res.data.decode())
    #     print(data)

    def test_distance_search(self):
        res = self.client.post('/auth/register', json=self.customer_data)
        data = json.loads(res.data.decode())
        token = data['token']
        body = {
            'search_term': 'indian',
            'token': token,
            'qty': 3,
            'user_lat':-33.753425,
            'user_long': 150.826884,
            'max_distance': 5
        }
        res = self.client.post('/searchDistance', json=body)
        data = json.loads(res.data.decode())
        print(data)

    def tearDown(self):
        with self.app.app_context():
            # Clear database after each test
            db.session.remove()
            db.drop_all()

if __name__ == '__main__':
    unittest.main()
