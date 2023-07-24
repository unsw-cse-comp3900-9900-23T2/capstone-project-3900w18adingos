from flask import Blueprint, jsonify, send_file
from flask import request, current_app
from flask_praetorian import current_user, auth_required
import os

from app.extensions import db
from app.models.eatery import Eatery, eatery_schema, eatery_schema_list
from app.models.image import Image
from app.eatery_helper import generate_image_filename

eatery = Blueprint('eatery', __name__)

@eatery.get('/get_image/<int:image_id>')
def get_eatery_image(image_id):
    image_obj = Image.query.get_or_404(image_id)
    # image_objs has .id, .eatery_id, .filepath fields (def'n in models/image.py)
    return send_file(os.path.join(current_app.config['IMAGE_SAVE_DIRECTORY'], image_obj.filepath), mimetype='image/jpg')
    

@eatery.post('/add_image')
@auth_required
def add_image():
    if not isinstance(current_user(), Eatery):
        return jsonify(success=False), 403
        
    # save image on disk
    f = request.files['file']
    filename = generate_image_filename()
    f.save(os.path.join(current_app.config['IMAGE_SAVE_DIRECTORY'], filename))

    # new Image instance to database
    new_image = Image(filepath=filename, eatery_id=current_user().id)
    db.session.add(new_image)
    db.session.commit()

    return jsonify(success=True), 201

@eatery.delete('/delete_image')
@auth_required
def delete_image():
    req_json = request.get_json()
    img_id = req_json['image_id'].strip()
    # given image id, find image filepath from db 
    image_obj = Image.query.filter_by(id=img_id, eatery_id=current_user().id).first_or_404()

    try:
        # delete image from disk
        # os.remove(image_obj.filepath)

        # delete image from db
        db.session.delete(image_obj)
        db.session.commit()
    except:
        return jsonify(success=False), 500

    return jsonify(success=True), 200

@eatery.get('/eatery')
def get_all_eateries():
    eateries = Eatery.query.all()
    return eatery_schema_list.dump(eateries), 200

@eatery.get('/eatery/<int:id>')
def get_eatery_by_id(id):
    eatery = Eatery.query.get_or_404(id)

    return eatery_schema.dump(eatery), 200

