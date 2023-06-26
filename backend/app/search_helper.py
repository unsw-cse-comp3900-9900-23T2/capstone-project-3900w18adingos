import sqlite3
from flask import jsonify
import pandas as pd
from app.database import db
from app.models.customer import Customer
from app.models.eatery import Eatery
from app.models.cuisine import Cuisine
from app.models.cooks_cuisine import CooksCuisine
from sqlalchemy import TypeCoerce, create_engine, func, literal, or_, type_coerce, and_
from sqlalchemy import cast, Float
from sqlalchemy.orm import sessionmaker
import math

engine = create_engine(db.engine.url)
Session = sessionmaker(bind=engine)
session = Session()

def eatery_search(search_term, token, qty=1):
    user = None
    user = Customer.verify_auth_token(token)
    if not user:
        return jsonify({"message": "Invalid token"}), 400
    # results = Eatery.query.filter(Eatery.restaurant_name.ilike(f"%{search_term}%")).all()

    # results_cuisine = Cuisine.query.filter
    # results = Eatery.query.filter(
    #     or_(
    #         Eatery.restaurant_name.ilike(f"%{search_term}%"),
    #         Eatery.cuisine.ilike(f"%{search_term}%")
    #     )
    # ).all()
    
    joined = Eatery.query.join(Cuisine, Cuisine.eatery_id == Eatery.id).all()
    results = joined.filter(
        or_(Cuisine.cuisine_name.ilike(f"%{search_term}%"),
         Eatery.restaurant_name.ilike(f"%{search_term}%"))
    ).all()
    # query = query.distinct(Eatery.restaurant_name)

    return_array = []
    i = 0
    for result in results:
        if i == qty:
            break
        eatery_info = {}
        eatery_info['name'] = result.restaurant_name
        eatery_info['longitude'] = result.longitude
        eatery_info['latitude'] = result.latitude
        return_array.append(eatery_info)
        i = i + 1

    return jsonify({'results': return_array})

# def distance(lat1, lon1, lat2, lon2):
#     """
#     Calculate the distance (in kilometers) between two points on the Earth's surface
#     using the Haversine formula.
#     """
#     earth_radius = 6371  # Radius of the Earth in kilometers

#     # Convert latitude and longitude to radians
#     lat1_rad = math.radians(lat1)
#     lon1_rad = math.radians(lon1)
#     lat2_rad = math.radians(lat2)
#     lon2_rad = math.radians(lon2)

#     # Calculate the differences between the latitudes and longitudes
#     delta_lat = lat2_rad - lat1_rad
#     delta_lon = lon2_rad - lon1_rad

#     # Calculate the Haversine formula
#     a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
#     c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
#     distance = earth_radius * c
#     print(distance)

#     return distance


def eatery_distance_search(token, search_term, user_long, user_lat, max_distance, qty=1):
    user = None
    user = Customer.verify_auth_token(token)
    if not user:
        return jsonify({"message": "Invalid token"}), 400

    joined = Eatery.query.join(Cuisine, Cuisine.eatery_id == Eatery.id)
    # results = joined.filter(
    #     or_(Cuisine.cuisine_name.ilike(f"%{search_term}%"),
    #      Eatery.restaurant_name.ilike(f"%{search_term}%"))
    # ).all()

    results = (
        joined
        .filter(
            and_(Eatery.distance(user_lat, user_long, max_distance),
                 or_(Cuisine.cuisine_name.ilike(f"%{search_term}%"),
                 Eatery.restaurant_name.ilike(f"%{search_term}%")))
        )
        .all()
    )


    return_array = []
    i = 0
    for eatery in results:
        if i == qty:
            break
        eatery_info = {}
        eatery_info['name'] = eatery.restaurant_name
        eatery_info['longitude'] = eatery.longitude
        eatery_info['latitude'] = eatery.latitude
        return_array.append(eatery_info)
        i = i + 1
    
    return jsonify({'results': return_array})
    
    
    
