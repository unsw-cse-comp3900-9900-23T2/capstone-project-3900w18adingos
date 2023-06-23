# from flask import jsonify, current_app
# from werkzeug.security import generate_password_hash, check_password_hash
# from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
# from app.models.user import User
# from app.database import db

# def user_profile_setname_v1(token, name_first, name_last, user_type):
#     """
#     Update the authorised user's first and last name
#     Parameters:
#         token (str)
#         name_first (str)
#         name_last (str)
#         user_type (str)
        
#     Returns:
#         {}
#     """
#     user = None
#     if user_type == 'customer':
#         user = Customer.verify_auth_token(token)
#     elif user_type == 'manager':
#         user = Manager.verify_auth_token(token)
        
#     if not user:
#         return jsonify({"message": "Invalid token"}), 400
    
#     user.name = name_first + ' ' + name_last
#     db.session.commit()
    
#     return jsonify({'message': 'Name updated successfully'})

# def customer_profile_setpic(token, pic_url):
#     """
#     Update the authorised customer's profile picture
#     Parameters:
#         token (str)
#         pic_url (str)
        
#     Returns:
#         {}
#     """
#     user = User.verify_auth_token(token)
#     if not user:
#         return jsonify({"message": "Invalid token"}), 400

#     if user.role != 'customer':
#         return jsonify({"message": "Only customers can update profile picture"}), 400

#     user.profile_pic = pic_url
#     db.session.commit()

#     return jsonify({'message': 'Profile picture updated successfully'})


# def manager_profile_set_restaurant_details(token, restaurant_name, address):
#     """
#     Update the authorised manager's restaurant details
#     Parameters:
#         token (str)
#         restaurant_name (str)
#         address (str)
        
#     Returns:
#         {}
#     """
#     manager = Manager.verify_auth_token(token)
    
#     if not manager:
#         return jsonify({"message": "Invalid token"}), 400
    
#     manager.restaurant_name = restaurant_name
#     manager.address = address
#     db.session.commit()
    
#     return jsonify({'message': 'Restaurant details updated successfully'})


# def manager_profile_upload_restaurant_pics(token, pics):
#     """
#     Upload pictures for the authorised manager's restaurant
#     Parameters:
#         token (str)
#         pics (list of str): list of URLs of the pics
        
#     Returns:
#         {}
#     """
#     manager = Manager.verify_auth_token(token)
    
#     if not manager:
#         return jsonify({"message": "Invalid token"}), 400

#     # Here we are assuming that pics is a list of URLs and we join them into a single string
#     manager.restaurant_pics = ','.join(pics)
#     db.session.commit()
    
#     return jsonify({'message': 'Restaurant pictures updated successfully'})
