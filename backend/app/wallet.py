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