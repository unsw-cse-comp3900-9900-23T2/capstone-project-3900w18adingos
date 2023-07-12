from flask import Blueprint, request
from app import search_helper
from flask_login import login_required

search_bp = Blueprint('search', __name__)

@login_required
@search_bp.route('/search', methods=['POST'])
def search_by_name():
    search_term = request.json.get('search_term')
    qty = request.json.get('qty')
    if qty:
        return search_helper.eatery_search(search_term, qty)
    else:
        return search_helper.eatery_search(search_term)

#max_distance in km
@login_required
@search_bp.route('/searchDistance', methods=['POST'])
def search_by_distance():
    search_term = request.json.get('search_term')
    # token = request.json.get('token')
    user_long = request.json.get('user_long')
    user_lat = request.json.get('user_lat')
    max_distance = request.json.get('max_distance')
    qty = request.json.get('qty')
    if qty:
        return search_helper.eatery_distance_search(search_term, user_long, user_lat, max_distance, qty)
    else:
        return search_helper.eatery_distance_search(search_term, user_long, user_lat, max_distance)