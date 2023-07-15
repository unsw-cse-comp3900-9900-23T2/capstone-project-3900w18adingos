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


class PreferencesTestCase(unittest.TestCase):
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
    
    # def test_add_preferences(self):
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

    #     body={
    #         'customer_id': 3,
    #         'cuisines': ['Chinese', 'Italian']
    #     }
    #     res = self.client.post('/add_preferences', json=body)
    #     data = json.loads(res.data.decode())
    #     print(data)

    def test_get_preferences(self):
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

        res = self.client.get('/get_preferences/3')
        data = json.loads(res.data.decode())
        print(data)

if __name__ == '__main__':
    unittest.main()