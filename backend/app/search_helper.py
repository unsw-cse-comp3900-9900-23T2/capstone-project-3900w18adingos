import sqlite3
from flask import jsonify
from app.database import db
from app.models.customer import Customer
from app.models.eatery import Eatery
from app.models.cuisine import Cuisine
from app.models.cooks_cuisine import CooksCuisine
from sqlalchemy import TypeCoerce, create_engine, func, literal, or_, type_coerce, and_
from sqlalchemy import cast, Float
from sqlalchemy.orm import sessionmaker, joinedload
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
    
    joined = db.session.query(Eatery).join(Eatery.cuisines).join(Cuisine).options(joinedload(Eatery.cuisines))
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

    return jsonify({'results': return_array}), 200


def eatery_distance_search(token, search_term, user_long, user_lat, max_distance, qty=1):
    user = None
    user = Customer.verify_auth_token(token)
    if not user:
        return jsonify({"message": "Invalid token"}), 400

    # joined = Eatery.query.join(Cuisine, Cuisine.eatery_id == Eatery.id)

    joined = db.session.query(Eatery).join(Eatery.cuisines).join(Cuisine).options(joinedload(Eatery.cuisines))

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
    
    return jsonify({'results': return_array}), 200
    
    
    
