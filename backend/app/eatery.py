from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
import os

from app.extensions import db
from app.models.eatery import Eatery
from app.models.image import Image
from app.eatery_helper import get_image_bytes, generate_image_filename
eatery = Blueprint('eatery', __name__)

# get all images of this eatery
@eatery.post('/get_images')
def get_eatery_images():
    req_json = request.get_json()
    eatery_id = req_json['eatery_id'].strip()
    image_objs = Eatery.query.get_or_404(eatery_id = eatery_id).first().eatery_images
    # image_objs has .id, .eatery_id, .filepath fields (def'n in models/image.py)

    encoded_images = []
    encoded_images_id = []
    for image_obj in image_objs:
        encoded_images.append(get_image_bytes(file_name=img.filepath))
        # serve image ids to frontend to allow for image deletion
        encoded_images_id.append(image_obj.id)
    return jsonify(
        {
            'images': encoded_images,
            'image_ids': encoded_images_id
        }
    ), 200

@eatery.post('/add_image')
@login_required
def add_image():
    # TODO check logged-in user is actually an eatery

    # save image on disk
    f = request.files['file']
    filename = generate_image_filename()
    f.save(os.path.join(app.config['IMAGE_SAVE_DIRECTORY'], filename))

    # new Image instance to database
    new_image = Image(filepath=filename, eatery_id=current_user.id)
    db.session.add(new_image)
    db.session.commit()

    return jsonify(success=True), 201

@eatery.delete('/delete_image')
@login_required
def delete_image():
    req_json = request.get_json()
    img_id = req_json['image_id'].strip()

    # given image id, find image filepath from db 
    image_obj = Image.query.first_or_404(id=img_id, eatery_id=current_user.id)

    try:
        # delete image from disk
        os.remove(image_obj.filepath)

        # delete image from db
        db.session.delete(image_obj)
        db.session.commit()
    except:
        return jsonify(success=False), 500

    return jsonify(success=True), 200

@eatery.route('/eatery', methods=['GET'])
def get_all_eateries():
    eateries = Eatery.query.all()
    if not eateries:
        return jsonify({"message": "No eateries found"}), 404

    eateries_list = []
    for eatery in eateries:
        eateries_list.append({
            "id": eatery.id,
            "email": eatery.email,
            "restaurant_name": eatery.restaurant_name,
            "location": eatery.location,
            # "cuisine": eatery.cuisine,
            "role": eatery.role,
            "latitude": eatery.latitude,
            "longitude": eatery.longitude
        })
    return jsonify({"eateries": eateries_list}), 200

@eatery.route('/eatery/<int:id>', methods=['GET'])
def get_eatery_by_id(id):
    eatery = Eatery.query.get(id)
    if not eatery:
        return jsonify({"message": "No eatery found"}), 404

    eatery_data = {
        "id": eatery.id,
        "email": eatery.email,
        "restaurant_name": eatery.restaurant_name,
        "location": eatery.location,
        # "cuisine": eatery.cuisine,
        "role": eatery.role,
        "latitude": eatery.latitude,
        "longitude": eatery.longitude,
        # "reviews": jsonify(Eatery.reviews),
        # "cuisine": eatery.cuisines
    }
    return jsonify({"eatery": eatery_data}), 200