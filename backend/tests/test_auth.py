import unittest
import json  # import json module
from app import create_app, db
from app.models.customer import Customer
from app.models.voucher import Voucher
from app.models.eatery import Eatery

from werkzeug.security import generate_password_hash


class AuthTestCase(unittest.TestCase):
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
            'name': 'Test Eatery',
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
            db.session.add(test_customer)

            hashed_password = generate_password_hash(self.eatery_data['password'], method='sha256')

            test_eatery = Eatery(email=self.eatery_data['email'], password_hash=hashed_password)
            test_eatery.name = self.eatery_data['name']
            db.session.add(test_eatery)

            db.session.commit()
    
    def test_registration(self):
        res = self.client.post('/auth/register', json=self.customer_data)
        data = json.loads(res.data.decode())
        print(data) 
        self.assertEqual(res.status_code, 200)
        self.assertIn('Registration successful', data['message'])
        print(res.data)


    def test_login(self):
        # Register the user first
        self.client.post('/auth/register', json=self.customer_data)

        # Login with the registered user's data
        res = self.client.post('/auth/login', json={'email': self.customer_data['email'], 'password': self.customer_data['password'], 'role': 'customer'})
        print(res.data) 
        data = json.loads(res.data.decode())
        self.assertEqual(res.status_code, 200)
        self.assertIn('token', data)

    def test_invalid_login(self):
        res = self.client.post('/auth/login', json={'email': 'invalid@invalid.com', 'password': 'invalidpass', 'role': 'customer'})
        data = json.loads(res.data.decode())
        self.assertEqual(res.status_code, 400)
        self.assertIn('Invalid credentials', data['message'])

    def tearDown(self):
        with self.app.app_context():
            # Clear database after each test
            db.session.remove()
            db.drop_all()

if __name__ == '__main__':
    unittest.main()
