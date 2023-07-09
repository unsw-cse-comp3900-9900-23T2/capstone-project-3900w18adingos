from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime
from app.extensions import db
from app.models.voucher import Voucher

vouchers = Blueprint('vouchers', __name__)

@vouchers.route('/vouchers', methods=['POST'])
@login_required
def create_discount():
    if current_user.role != 'eatery':
        return jsonify({"message": "Unauthorized"}), 403

    name = request.json.get('name')
    description = request.json.get('description')
    discount_code = request.json.get('discount_code')
    discount_percentage = request.json.get('discount_percentage')
    start_date = datetime.strptime(request.json.get('start_date'), '%Y-%m-%d')
    end_date = datetime.strptime(request.json.get('end_date'), '%Y-%m-%d')
    is_active = request.json.get('is_active')

    discount = Discount(
        name=name,
        description=description,
        discount_code=discount_code,
        discount_percentage=discount_percentage,
        start_date=start_date,
        end_date=end_date,
        is_active=is_active
    )

    db.session.add(discount)
    db.session.commit()

    return jsonify({"message": "Discount created"}), 200

@vouchers.route('/vouchers', methods=['GET'])
def get_vouchers():
    vouchers = Discount.query.all()
    return jsonify([discount.serialize() for discount in vouchers]), 200

@vouchers.route('/vouchers/<int:id>', methods=['GET'])
def get_discount(id):
    discount = Discount.query.get(id)
    return jsonify(discount.serialize()), 200

@vouchers.route('/vouchers/<int:id>', methods=['PUT'])
@login_required
def update_discount(id):
    if current_user.role != 'eatery':
        return jsonify({"message": "Unauthorized"}), 403

    discount = Discount.query.get(id)

    # Update fields based on request.json here

    db.session.commit()
    return jsonify({"message": "Discount updated"}), 200

@vouchers.route('/vouchers/<int:id>', methods=['DELETE'])
@login_required
def delete_discount(id):
    if current_user.role != 'eatery':
        return jsonify({"message": "Unauthorized"}), 403

    discount = Discount.query.get(id)

    db.session.delete(discount)
    db.session.commit()

    return jsonify({"message": "Discount deleted"}), 200
