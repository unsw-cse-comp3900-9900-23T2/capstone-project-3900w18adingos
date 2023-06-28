from flask import Blueprint, request
from app import search_helper

search_bp = Blueprint('search', __name__)

@search_bp.route('/search', methods=['POST'])
def search_by_name():
    search_term = request.json.get('search_term')
    token = request.json.get('token')
    qty = request.json.get('qty')
    if qty:
        return search_helper.eatery_search(search_term, token, qty)
    else:
        return search_helper.eatery_search(search_term, token)

#max_distance in km
@search_bp.route('/searchDistance', methods=['POST'])
def search_by_distance():
    search_term = request.json.get('search_term')
    token = request.json.get('token')
    user_long = request.json.get('user_long')
    user_lat = request.json.get('user_lat')
    max_distance = request.json.get('max_distance')
    qty = request.json.get('qty')
    if qty:
        return search_helper.eatery_distance_search(token, search_term, user_long, user_lat, max_distance, qty)
    else:
        return search_helper.eatery_distance_search(token, search_term, user_long, user_lat, max_distance)