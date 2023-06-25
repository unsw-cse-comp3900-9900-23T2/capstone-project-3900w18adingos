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
from werkzeug.security import generate_password_hash

class UserUtilsTestCase(unittest.TestCase):
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

            # Creating a new customer
            hashed_password = generate_password_hash(self.customer_data['password'], method='sha256')
            test_customer = Customer(email=self.customer_data['email'], password_hash=hashed_password, name=self.customer_data['name'])
            db.session.add(test_customer)

            # Creating a new eatery
            hashed_password = generate_password_hash(self.eatery_data['password'], method='sha256')
            test_eatery = Eatery(email=self.eatery_data['email'], password_hash=hashed_password, name=self.eatery_data['restaurant_name'])
            db.session.add(test_eatery)

            db.session.commit()

            # Fetching the newly created customer and eatery to generate their tokens
            self.customer_token = Customer.query.filter_by(email=self.customer_data['email']).first().generate_auth_token()
            self.eatery_token = Eatery.query.filter_by(email=self.eatery_data['email']).first().generate_auth_token()

    def test_set_profile_pic(self):
        # assuming the route for setting profile pic is '/user/set_profile_pic'
        res = self.client.post('/user/set_profile_pic', 
                               json={'token': self.customer_token, 
                                     'pic_url': 'http://example.com/pic.jpg', 
                                     'role': 'customer'})
        data = json.loads(res.data.decode())
        self.assertEqual(res.status_code, 200)
        self.assertIn('Customer profile picture updated successfully', data['message'])

    def test_set_eatery_details(self):
        # assuming the route for setting eatery details is '/user/set_eatery_details'
        res = self.client.post('/user/set_eatery_details', 
                               json={'token': self.eatery_token, 
                                     'restaurant_name': 'New Name', 
                                     'address': 'New Address', 
                                     'cuisine': 'New Cuisine'})
        data = json.loads(res.data.decode())
        self.assertEqual(res.status_code, 200)
        self.assertIn('Eatery details updated successfully', data['message'])

    def test_upload_restaurant_pics(self):
        # assuming the route for uploading restaurant pics is '/user/upload_restaurant_pics'
        res = self.client.post('/user/upload_restaurant_pics', 
                               json={'token': self.eatery_token, 
                                     'pics': ['http://example.com/pic1.jpg', 
                                              'http://example.com/pic2.jpg']})
        data = json.loads(res.data.decode())
        self.assertEqual(res.status_code, 200)
        self.assertIn('Eatery pictures updated successfully', data['message'])

    def tearDown(self):
        with self.app.app_context():
            # Clear database after each test
            db.session.remove()
            db.drop_all()


if __name__ == '__main__':
    unittest.main()
