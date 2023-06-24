from flask import Blueprint, request, jsonify
from app import user_helper

user = Blueprint('user', __name__)

@user.route('/user/set_profile_pic', methods=['POST'])
def update_profile_pic():
    data = request.get_json()
    return user_helper.set_profile_pic(data['token'], data['pic_url'], data['role'])

@user.route('/user/customer_details', methods=['POST'])
def update_customer_info():
    data = request.get_json()
    return user_helper.update_customer_details(data['token'], data.get('new_name'), data.get('new_email'))

@user.route('/user/eatery_details', methods=['POST'])
def update_eatery_info():
    data = request.get_json()
    return user_helper.set_eatery_details(data['token'], data.get('restaurant_name'), data.get('cuisine'), data.get('address'))

@user.route('/user/upload_restaurant_pics', methods=['POST'])
def upload_pics():
    data = request.get_json()
    return user_helper.upload_restaurant_pics(data['token'], data['pics'])