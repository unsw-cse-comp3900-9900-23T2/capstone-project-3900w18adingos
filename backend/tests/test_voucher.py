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


class VoucherTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(config_name='testing')
        self.client = self.app.test_client()
        self.customer_data = {
            'email': 'testcustomer@example.com',
            'password': '123',
            'name': 'Test Customer',
            'role': 'customer'
        }

        with self.app.app_context():
            # create all tables
            db.create_all()

    def test_voucher_creation(self):
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
        body={
            'description': '50 percent off',
            'eatery_id': 3,
            'quantity': 250,
            'start': '11:59:00 12/07/2023',
            'expiry': '12:00:00 14/07/2023'
        }
        res = self.client.post('/create_voucher', json=body)
        data = json.loads(res.data.decode())
        print(data)

    def test_delete(self):
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

        res = self.client.delete('/delete_voucher/19')
        data = json.loads(res.data.decode())
        print(data)

    def test_voucher_update(self):
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
        body={
            'quantity': 0,
        }
        res = self.client.put('/edit_voucher/3', json=body)
        data = json.loads(res.data.decode())
        print(data)

    def test_voucher_get_eatery(self):
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
        res = self.client.get('/get_vouchers_eatery/3')
        data = json.loads(res.data.decode())
        print(data)

    def test_voucher_get_customer(self):
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
        # data = {
        #     'customer_id': 5,
        #     'voucher_id': 3
        # }
        # res = self.client.post('/claim_voucher', json=data)
        res = self.client.get('/get_vouchers_customer/5')
        data = json.loads(res.data.decode())
        print(data)

    def test_claim_voucher(self):
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
        data = {
            'customer_id': 4,
            'voucher_id': 3
        }
        res = self.client.post('/claim_voucher', json=data)
        data = json.loads(res.data.decode())
        print(data)

    def test_redeem_voucher(self):
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
        data = {
            'customer_id': 5,
            'voucher_id': 20
        }
        res = self.client.post('/redeem_voucher', json=data)
        data = json.loads(res.data.decode())
        print(data)

    

    # def tearDown(self):
    #     with self.app.app_context():
    #         # Clear database after each test
    #         db.session.remove()
    #         db.drop_all()


if __name__ == '__main__':
    unittest.main()