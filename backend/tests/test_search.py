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
            'password': '123',
            'name': 'Test Customer',
            'role': 'customer'
        }
        self.eatery_data = {
            'email': 'testeatery@example.com',
            'password': '123',
            'restaurant_name': 'Test Eatery',
            'role': 'eatery'
        }

        with self.app.app_context():
            # create all tables
            db.create_all()
            #Customer.query.delete()
            #Eatery.query.delete()
            # db.session.add(test_customer)

            hashed_password = generate_password_hash(self.eatery_data['password'], method='sha256')

            # test_eatery = Eatery(email=self.eatery_data['email'], password_hash=hashed_password)
            # test_eatery.restaurant_name = self.eatery_data['restaurant_name']
            # test_eatery.location = "25 john st somewhere idk"
            # db.session.add(test_eatery)

            # db.session.commit()
            # db.session.add(Eatery(id = 10,
            #                      email=self.eatery_data['email'],
            #                      password_hash=hashed_password,
            #                      restaurant_name=self.eatery_data['restaurant_name'],
            #                      location="13 Some Street Kensington 2033 NSW",
            #                      latitude=-33.896549,
            #                      longitude=151.179962))
            # db.session.add(Eatery(id = 11,
            #                      email='mcdonalds@gmail.com',
            #                      password_hash=hashed_password,
            #                      restaurant_name="McDonald's",
            #                      location="12 Barker Street Kensington 2033 NSW",
            #                      latitude=-33.890025,
            #                      longitude=151.194498))
            # db.session.add(Eatery(id = 12,
            #                      email='joe@gmail.com',
            #                      password_hash=hashed_password,
            #                      restaurant_name="Joe's Pizza",
            #                      location="13 Henry Street Kensington 2033 NSW",
            #                      latitude=-33.690210,
            #                      longitude=151.190208))
            # db.session.add(Eatery(id = 13,
            #                      email='thai@gmail.com',
            #                      password_hash=hashed_password,
            #                      restaurant_name="Thai Place",
            #                      location="13 John Street Kensington 2033 NSW",
            #                      latitude=-33.828644,
            #                      longitude=151.245937))
            # db.session.add(Eatery(id = 14,
            #                      email='ambatukam@gmail.com',
            #                      password_hash=hashed_password,
            #                      restaurant_name="Ambatukam's Indian",
            #                      location="13 George Street Bondi 2033 NSW",
            #                      latitude=-33.819831,
            #                      longitude=151.231432))
            # db.session.add(Eatery(id = 15,
            #                      email='indian@gmail.com',
            #                      password_hash=hashed_password,
            #                      restaurant_name="HurryCurry indian",
            #                      location="34 Monash Street Kingsford 2034 NSW",
            #                      latitude=-33.902479,
            #                      longitude=151.171137))
            
            # db.session.add(Cuisine(id=1,
            #                        cuisine_name="Chinese"))
            # db.session.add(Cuisine(id=2,
            #                        cuisine_name="American"))
            # db.session.add(Cuisine(id=3,
            #                        cuisine_name="Italian"))
            # db.session.add(Cuisine(id=4,
            #                        cuisine_name="Thai"))
            # db.session.add(Cuisine(id=5,
            #                        cuisine_name="Indian"))
            
            # db.session.add(CooksCuisine(id=1,
            #                             eatery_id = 10,
            #                             cuisine_id = 1))
            # db.session.add(CooksCuisine(id=2,
            #                             eatery_id = 11,
            #                             cuisine_id = 2))
            # db.session.add(CooksCuisine(id=3,
            #                             eatery_id = 12,
            #                             cuisine_id = 3))
            # db.session.add(CooksCuisine(id=4,
            #                             eatery_id = 13,
            #                             cuisine_id = 4))
            # db.session.add(CooksCuisine(id=5,
            #                             eatery_id = 14,
            #                             cuisine_id = 5))
            # db.session.add(CooksCuisine(id=6,
            #                             eatery_id = 15,
            #                             cuisine_id = 5))
            # db.session.add(CooksCuisine(id=7,
            #                             eatery_id = 15,
            #                             cuisine_id = 4))

            # db.session.commit()
    
    def test_search_name(self):
        res = self.client.post('/auth/register', json=self.customer_data)
        data = json.loads(res.data.decode())
        try:
            if data['message'] == 'Customer with that email already exists':
                customer_data = {
                    'email': 'testcustomer@example.com',
                    'password': '123',
                    'role': 'customer'
                }
                res = self.client.post('/auth/login', json=customer_data)
                data = json.loads(res.data.decode())
        except:
            pass
        token = data['token']
        body = {
            'search_term': 'thai',
            'token': token,
            'qty': 3
        }
        res = self.client.post('/search', json=body)
        data = json.loads(res.data.decode())
        expected = ["HurryCurry indian", 'Thai Place']
        print('name ', data)
        for result in data['results']:
            self.assertIn(result['name'], expected)

    # def test_distance_search(self):
    #     res = self.client.post('/auth/register', json=self.customer_data)
    #     data = json.loads(res.data.decode())
    #     try:
    #         if data['message'] == 'Customer with that email already exists':
    #             customer_data = {
    #                 'email': 'testcustomer@example.com',
    #                 'password': '123',
    #                 'role': 'customer'
    #             }
    #             res = self.client.post('/auth/login', json=customer_data)
    #             data = json.loads(res.data.decode())
    #     except:
    #         pass
    #     token = data['token']
    #     body = {
    #         'search_term': '',
    #         'token': token,
    #         'qty': 8,
    #         'user_lat':-33.864928,
    #         'user_long': 151.217594,
    #         'max_distance': 5
    #     }
    #     res = self.client.post('/searchDistance', json=body)
    #     data = json.loads(res.data.decode())
    #     print('location', data)
    #     expected = ['Test Eatery', "McDonald's", 'Thai Place']
    #     for result in data['results']:
    #         self.assertIn(result['name'], expected)

    # def tearDown(self):
    #     with self.app.app_context():
    #         # Clear database after each test
    #         db.session.remove()
    #         db.drop_all()

if __name__ == '__main__':
    unittest.main()
