from flask import Blueprint, request
from flask import jsonify
from app.extensions import db
from datetime import datetime
from app.models.voucher import Voucher
from app.models.eatery import Eatery
from flask_login import login_required
voucher = Blueprint('voucher', __name__)
date_format = "%H:%M:%S %d/%m/%Y"

#date_string_example = "12:34:56 06/07/2023"

@voucher.route('/create_voucher', methods=['POST'])
@login_required
def create_voucher():
    description = request.json.get('description')
    eatery_id = request.json.get('eatery_id')
    quantity = request.json.get('quantity')
    #like 0.3 for 30% discount
    try:
        rate = request.json.get('rate')
    except:
        pass
    start = request.json.get('start')
    expiry = request.json.get('expiry')

    start_dt = datetime.strptime(start, date_format)
    expiry_dt = datetime.strptime(expiry, date_format)

    new_voucher = Voucher(description, eatery_id, quantity, rate, start_dt, expiry_dt)
    db.session.add(new_voucher)
    db.session.commit()

    return jsonify({'message': 'added voucher'}), 201

@voucher.delete('/delete_voucher')
@login_required
def delete_review(voucher_id):
    voucher = Voucher.query.first_or_404(voucher_id)
    db.session.delete(voucher)
    db.session.commit()
    return jsonify({'message': f'voucher {voucher_id} deleted'}), 200
