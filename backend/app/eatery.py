from flask import Blueprint, request
from flask_login import login_required, current_user
import json
import os

from app.database import db
from app.eatery_helper import get_image_bytes, generate_image_filename

from app.models.eatery import Eatery
from app.models.image import Image
from app.models.menuitem import MenuItem

eatery = Blueprint('eatery', __name__)

# get all images of this eatery
@eatery.post('/get_images')
def get_eatery_images():
    req_json = request.get_json()
    eatery_id = req_json['eatery_id'].strip()
    image_objs = Eatery.query.get_or_404(eatery_id).eatery_images
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

# for eatery managers, add image
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
    image_obj = Image.query.filter_by(id=img_id, eatery_id=current_user.id).first_or_404()

    try:
        # delete image from disk
        os.remove(image_obj.filepath)

        # delete image from db
        db.session.delete(image_obj)
        db.session.commit()
    except:
        return jsonify(success=False), 500

    return jsonify(success=True), 200

@eatery.post('/get_menu_items')
def get_eatery_menu_items():
    req_json = request.get_json()
    eatery_id = req_json['eatery_id'].strip()
    menu_items = Eatery.query.get_or_404(eatery_id = eatery_id).menu_items

    menu_items_arr = []
    for menu_item in menu_items:
        menu_items_arr.append(json.dumps(
            {
                'id': menu_item.id,
                'name': menu_item.name,
                'description': menu_item.description,
                'price': menu_item.price
            }
        ))
    return jsonify(
        {
            'menu_items': menu_items_arr
        }
    ), 200

@eatery.post('/add_menu_item')
@login_required
def add_eatery_menu_item():
    # TODO check logged-in user is actually an eatery

    req_json = request.get_json()

    eatery = Eatery.query.get_or_404(eatery_id = current_user.id)

    new_menu_item = MenuItem(name=req_json['name'], description=req_json['description'], price=req_json['price'])
    eatery.menu_items.append(new_menu_item)
    db.session.commit()

    return jsonify(success=True), 201

@eatery.delete('/delete_menu_item')
@login_required
def delete_eatery_menu_item():
    # TODO check logged-in user is actually an eatery

    req_json = request.get_json()

    eatery = Eatery.query.get_or_404(eatery_id = current_user.id)

    menu_item = MenuItem.query.get_or_404(eatery_id = current_user.id)

    db.session.commit()

    return jsonify(success=True), 200

@eatery.post('/edit_menu_item')
@login_required
def edit_eatery_menu_item():
    # TODO check logged-in user is actually an eatery

    req_json = request.get_json()

    menu_item = MenuItem.query.get_or_404(eatery_id = current_user.id)
    
    menu_item.price=req_json['price']
    menu_item.name=req_json['name']
    menu_item.description=req_json['description']

    db.session.commit()

    return jsonify(success=True), 200