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
from app.models.cooks_cuisine import CooksCuisine
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
                                 latitude=-33.761710,
                                 longitude=150.837636))
            db.session.add(Eatery(id = 2,
                                 email='mcdonalds@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="McDonald's",
                                 latitude=-33.575212,
                                 longitude=151.239309))
            db.session.add(Eatery(id = 3,
                                 email='joe@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="Joe's Pizza",
                                 latitude=-33.690210,
                                 longitude=151.054477))
            db.session.add(Eatery(id = 4,
                                 email='thai@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="Thai Place",
                                 latitude=-33.739130,
                                 longitude=151.057051))
            db.session.add(Eatery(id = 5,
                                 email='ambatukam@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="Ambatukam's",
                                 latitude=-33.789106,
                                 longitude=151.065186))
            db.session.add(Eatery(id = 6,
                                 email='indian@gmail.com',
                                 password_hash=hashed_password,
                                 restaurant_name="HurryCurry indian",
                                 latitude=-33.760197,
                                 longitude=150.819598))
            
            db.session.add(Cuisine(id=1,
                                   cuisine_name="Chinese"))
            db.session.add(Cuisine(id=2,
                                   cuisine_name="American"))
            db.session.add(Cuisine(id=3,
                                   cuisine_name="Italian"))
            db.session.add(Cuisine(id=4,
                                   cuisine_name="Thai"))
            db.session.add(Cuisine(id=5,
                                   cuisine_name="Indian"))
            
            db.session.add(CooksCuisine(id=1,
                                        eatery_id = 1,
                                        cuisine_id = 1))
            db.session.add(CooksCuisine(id=2,
                                        eatery_id = 2,
                                        cuisine_id = 2))
            db.session.add(CooksCuisine(id=3,
                                        eatery_id = 3,
                                        cuisine_id = 3))
            db.session.add(CooksCuisine(id=4,
                                        eatery_id = 4,
                                        cuisine_id = 4))
            db.session.add(CooksCuisine(id=5,
                                        eatery_id = 5,
                                        cuisine_id = 5))
            db.session.add(CooksCuisine(id=6,
                                        eatery_id = 6,
                                        cuisine_id = 5))
            db.session.add(CooksCuisine(id=7,
                                        eatery_id = 6,
                                        cuisine_id = 4))

            db.session.commit()
    
    def test_search_name(self):
        res = self.client.post('/auth/register', json=self.customer_data)
        data = json.loads(res.data.decode())
        token = data['token']
        body = {
            'search_term': 'thai',
            'token': token,
            'qty': 3
        }
        res = self.client.post('/search', json=body)
        data = json.loads(res.data.decode())
        expected = ["HurryCurry indian", 'Thai Place']
        for result in data['results']:
            self.assertIn(result['name'], expected)
        print('name ', data)
        # hurry curry and thai expected

    def test_distance_search(self):
        res = self.client.post('/auth/register', json=self.customer_data)
        data = json.loads(res.data.decode())
        token = data['token']
        body = {
            'search_term': 'indian',
            'token': token,
            'qty': 3,
            'user_lat':-33.753489,
            'user_long': 150.829398,
            'max_distance': 5
        }
        res = self.client.post('/searchDistance', json=body)
        data = json.loads(res.data.decode())
        self.assertEqual(data['results'][0]['name'], "HurryCurry indian")
        print('location', data)

    def tearDown(self):
        with self.app.app_context():
            # Clear database after each test
            db.session.remove()
            db.drop_all()

if __name__ == '__main__':
    unittest.main()
