from flask import Blueprint, request, jsonify
from flask_praetorian import auth_required, current_user

from app.extensions import db
from app.models.eatery import Eatery
from app.models.customer import Customer, customer_schema
from app.models.voucher import Voucher
from app.models.has_voucher import HasVoucher, has_voucher_schema_list

from app.wallet_helper import code_dict, generate_short_code

import qrcode
import base64
from io import BytesIO

wallet = Blueprint('wallet', __name__)

@wallet.get('/get_short_code')
@auth_required
def get_short_code():
    current_user_obj = current_user()
    
    if not isinstance(current_user_obj, Customer):
        return jsonify(success=False), 403

    code = generate_short_code()
    # regenerate if collision
    while code in code_dict:
        code = generate_short_code()
    
    code_dict[code] = current_user_obj.id

    img = qrcode.make(code)
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
        
    return jsonify(code=code, qr_code=img_str), 200
    
@wallet.post('/get_user_vouchers')
@auth_required
def get_user_vouchers():
    
    if not isinstance(current_user(), Eatery):
        return jsonify(success=False), 403

    code = request.json.get('code').upper()    
    customer_id = code_dict.get(code)
    if not customer_id:
        return jsonify(success=False), 404
        
    customer=Customer.query.get_or_404(customer_id)
    
    return has_voucher_schema_list.dump(customer.vouchers), 200

@wallet.route('/add_points/<customer_id>', methods=['POST'])
@auth_required
def add_points(customer_id):
    points_to_add = request.json.get('points')
    customer = Customer.query.get_or_404(customer_id)

    customer.points += points_to_add
    db.session.commit()

    return jsonify({'message': f'Added {points_to_add} points to customer {customer_id}. They now have {customer.points} points.'}), 200

@wallet.route('/subtract_points/<customer_id>', methods=['POST'])
@auth_required
def subtract_points(customer_id):
    
    points_to_subtract = request.json.get('points')
    customer = Customer.query.get_or_404(customer_id)

    if customer.points < points_to_subtract:
        return jsonify({'message': f'Error: customer {customer_id} only has {customer.points} points, but you tried to subtract {points_to_subtract}.'}), 400

    customer.points -= points_to_subtract
    db.session.commit()

    return jsonify({'message': f'Subtracted {points_to_subtract} points from customer {customer_id}. They now have {customer.points} points.'}), 200


def get_customer_vouchers_for_eatery(customer_id, eatery_id):
    eatery_vouchers = Voucher.query.filter(Voucher.eatery == eatery_id).all()
    has_vouchers = HasVoucher.query.filter((HasVoucher.customer_id == customer_id)).all()

    vouchers = []
    for has_voucher in has_vouchers:
        voucher = Voucher.query.filter(Voucher.id == has_voucher.voucher_id).first()
        if voucher in eatery_vouchers:
            vouchers.append({
                'id': voucher.id,
                'description': voucher.description,
                'quantity': voucher.quantity,
                'start': voucher.start,
                'expiry': voucher.expiry,
                'eatery_id': voucher.eatery
            })

    return vouchers

@wallet.get('/get_customer_info/<customer_id>')
@auth_required
def get_customer_info(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    eatery_id = ... 

    points = customer.points
    vouchers = get_customer_vouchers_for_eatery(customer_id, eatery_id)

    return jsonify({
        'name': customer.name,
        'points': points,
        'vouchers': vouchers,
    }), 200


@wallet.route('/get_vouchers_eatery_scan', methods=['POST'])
@auth_required
def get_vouchers_eatery_scan():
    customer_id = request.json.get('customer_id')
    eatery_id = request.json.get('eatery_id')
    vouchers = get_customer_vouchers_for_eatery(customer_id, eatery_id)

    return jsonify({'vouchers': vouchers}), 200