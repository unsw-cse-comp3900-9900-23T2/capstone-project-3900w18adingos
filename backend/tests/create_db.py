import datetime
import sys
import os



SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from app import create_app, db
from app.models.eatery import Eatery
from app.models.cuisine import Cuisine
from app.models.cooks_cuisine import CooksCuisine
from app.models.image import Image
from app.models.review import Review
from app.models.customer import Customer
from app.models.voucher import Voucher
from app.models.has_voucher import HasVoucher
from werkzeug.security import generate_password_hash

hashed_password = generate_password_hash('123', method='sha256')

eatery_arr = [

    # Kingsford
    Eatery(
        restaurant_name="McDonald's Kingsford",
        email='mcds@fake.com',
        latitude=-33.91966242470431,
        longitude=151.22743957038773,
        password_hash='pbkdf2:sha256:600000$F2ZJtimnmLtzLcpv$97279b2083834aaf6849dc41c2dd3f50f692618a832f682c0a2b47074ee5b4af',
        location='10 Barker St, Kingsford NSW 2032'
    ),
    Eatery(
        restaurant_name='Regent Hotel',
        email='rege@fake.com',
        latitude=-33.92094547443076,
        longitude=151.22726800730348,
        password_hash='pbkdf2:sha256:600000$TIgfP0A7YQtFs6eo$b6f4e3cf5b9c56d786598b4ea451df4c23ff72f3afa8fcb5f808346e93ac2ffb',
        location='416-418 Anzac Parade, Kingsford NSW 2032'
    ),
    Eatery(
        restaurant_name='Churchills Sports Bar',
        email='churchies@fake.com',
        latitude=-33.92373346017343,
        longitude=151.2282260894706,
        password_hash='pbkdf2:sha256:600000$auUyyjxMkYyTBanh$14c32c80c87fb953acb7487a42e6c016f4a48dd5a12593d4d08bd05c51a6dbf8',
        location='536 Anzac Parade, Kingsford NSW 2032'
    ),
    Eatery(
        restaurant_name='Time For Thai',
        email='tft@fake.com',
        latitude=-33.92218351458226,
        longitude=151.2267275092203,
        password_hash='pbkdf2:sha256:600000$NejiLN9ftEcbNbpy$9932a4626cb7521c45055fe8e56e59e31b1c2d8efde9b58606bc4d54085dd555',
        location='2/309 Anzac Parade, Kingsford NSW 2032'
    ),
    Eatery(
        restaurant_name='Papa Hans',
        email='papahans@fake.com',
        latitude=-33.922582064553424,
        longitude=151.2267606094381,
        password_hash='pbkdf2:sha256:600000$MKZgSRjD5Y4reKXa$ed20a1abd82b6036def774bba49fd63c83d2e5a54d35a5b2adbd7449088dc39a',
        location='323 Anzac Parade, Kingsford NSW 2032'
    ),
    Eatery(
        restaurant_name='Zhou Mum Cafe',
        email='zhoumum@fake.com',
        latitude=-33.920153566605,
        longitude=151.22636714754267,
        password_hash='pbkdf2:sha256:600000$PJSR8Vaw3tV2xRe9$43d34454172c307e8ae20309764ae2462663677e32b1d1203ee93e27f21f827c',
        location='243-245 Anzac Parade, Kingsford NSW 2032'
    ),
    Eatery(
        restaurant_name='The Old Place Tobbacconist',
        email='oldplace@fake.com',
        latitude=-33.922376810853805,
        longitude=151.22683114334558,
        password_hash='pbkdf2:sha256:600000$Ezt3hHh84krlLTXP$1b0f968400911f8e2b03a79342b069e655fb597278622ea29f9bf2b0f49e4505',
        location='315 Anzac Parade, Kingsford NSW 2032'
    ),
    Eatery(
        restaurant_name='Tokyo Super',
        email='tokyosuper@fake.com',
        latitude=-33.92212860007362,
        longitude=151.22671365734158,
        password_hash='pbkdf2:sha256:600000$G2FO0ncstOHVcjBh$b19726c78dbee73935527437f8eeece64e4aacbf44345b961ce223b9fb2f27b1',
        location='307 Anzac Parade, Kingsford NSW 2032'
    ),
    Eatery(
        restaurant_name='Shalom Kingsford',
        email='shalom@fake.com',
        latitude=-33.922013642754635,
        longitude=151.2271671069826,
        password_hash='pbkdf2:sha256:600000$IyU3vaY4j68DiJMm$8600ab3113b6bfddedc47a3ea44e7a61e1a86e3399875d29fbbc19f8988a0efc',
        location='2/458 Anzac Parade, Kingsford NSW 2032'
    ),
    # other Sydney
    Eatery(
        restaurant_name='Coogee Pavilion',
        email='coogeepav@fake.com',
        latitude=-33.91854837293536,
        longitude=151.25867325121,
        password_hash='pbkdf2:sha256:600000$a6QiToG6WYDOItEj$243bffaa006c368ed6de07a53a79d175cd2e6c27928c7ec9611044a1440a58d3',
        location='Ground Floor, 169 Dolphin St, Coogee NSW 2034'
    ),
    Eatery(
        restaurant_name="Ryan's Bar",
        email='ryansbar@fake.com',
        latitude=-33.86505856846632,
        longitude=151.2081175261286,
        password_hash='pbkdf2:sha256:600000$f1Q8rhorJNzYWBh4$9fd004c4e53b785fb6aa5612346a9f9f8fb1bcb3f8a6332aac664c7ad923c1a6',
        location='264-278 George St, Sydney NSW 2000'
    ),
    Eatery(
        restaurant_name='Union Hotel',
        email='unionhotel@fake.com',
        latitude=-33.90376265121743,
        longitude=151.18028962673472,
        password_hash='pbkdf2:sha256:600000$jSt4gBPWzmfzZY2M$71c48fcc48804b09de97108c6ad8cca02055e44814227d6e0692f3e9dc852e81',
        location='576 King St, Newtown NSW 2042'
    ),
    Eatery(
        restaurant_name='Dove & Olive',
        email='doveolive@fake.com',
        latitude=-33.8869720595346,
        longitude=151.21005833871993,
        password_hash='pbkdf2:sha256:600000$wHn4COyB73CnkSgW$2c6fb8dc883a6fb039a0f3d8a9092bca6ed62a2f5fe4b7973a8b5ed7735ea6a9',
        location='156 Devonshire St, Surry Hills NSW 2010'
    ),
    Eatery(
        restaurant_name='Rooty Hill RSL',
        email='rootyhillrsl@fake.com',
        latitude=-33.77024903871825,
        longitude=150.83422849428325,
        password_hash='pbkdf2:sha256:600000$NuofyOuEvpvcaBKv$4f584e4884f8ca7e382a69a92102a08f32f1882bbad1d95996f21f92bb0ff37c',
        location='33 Railway St, Rooty Hill NSW 2766'
    ),
    Eatery(
        email='testeatery@example.com',
        password_hash=hashed_password,
        restaurant_name='Test Eatery',
        location="13 Some Street Kensington 2033 NSW",
        latitude=-33.896549,
        longitude=151.179962
    ),
    Eatery(
        email='mcdonalds@gmail.com',
        password_hash=hashed_password,
        restaurant_name="McDonald's",
        location="12 Barker Street Kensington 2033 NSW",
        latitude=-33.890025,
        longitude=151.194498
    ),
    Eatery(
        email='joe@gmail.com',
        password_hash=hashed_password,
        restaurant_name="Joe's Pizza",
        location="13 Henry Street Kensington 2033 NSW",
        latitude=-33.690210,
        longitude=151.190208
    ),
    Eatery(
        email='thai@gmail.com',
        password_hash=hashed_password,
        restaurant_name="Thai Place",
        location="13 John Street Kensington 2033 NSW",
        latitude=-33.828644,
        longitude=151.245937
    ),
    Eatery(
        email='ambatukam@gmail.com',
        password_hash=hashed_password,
        restaurant_name="Ambatukam's Indian",
        location="13 George Street Bondi 2033 NSW",
        latitude=-33.819831,
        longitude=151.231432
    ),
    Eatery(
        email='indian@gmail.com',
        password_hash=hashed_password,
        restaurant_name="HurryCurry indian",
        location="34 Monash Street Kingsford 2034 NSW",
        latitude=-33.902479,
        longitude=151.171137
    ),
]

cuisine_arr=[
    Cuisine(cuisine_name="Chinese"),
    Cuisine(cuisine_name="American"),
    Cuisine(cuisine_name="Italian"),
    Cuisine(cuisine_name="Thai"),
    Cuisine(cuisine_name="Indian")
]

cooks_cuisine_arr=[
    CooksCuisine(
                eatery_id = 15,
                cuisine_id = 1),
    CooksCuisine(
                eatery_id = 16,
                cuisine_id = 2),
    CooksCuisine(
                eatery_id = 17,
                cuisine_id = 3),
    CooksCuisine(
                eatery_id = 18,
                cuisine_id = 4),
    CooksCuisine(
                eatery_id = 19,
                cuisine_id = 5),
    CooksCuisine(
                eatery_id = 20,
                cuisine_id = 5),
    CooksCuisine(
                eatery_id = 20,
                cuisine_id = 4)
]

customers_arr=[
    Customer(
            name="John", 
            email="email1@email.com",
            password_hash=hashed_password,
            handle="John1"),
    Customer(
            name="John2", 
            email="email2@email.com",
            password_hash=hashed_password,
            handle="John2"),
    Customer(
            name="John3", 
            email="email3@email.com",
            password_hash=hashed_password,
            handle="John3"),
    Customer(
            name="John4", 
            email="email4@email.com",
            password_hash=hashed_password,
            handle="John4")
]

reviews_arr=[
    Review(rating=4,
           review_text='yeah its alright',
           customer_id=1,
           eatery_id=1),
    Review(rating=5,
           review_text='ye na not bad',
           customer_id=1,
           eatery_id=2),
    Review(rating=1,
           review_text='bad',
           customer_id=2,
           eatery_id=3),
    Review(rating=7,
           review_text='good good',
           customer_id=3,
           eatery_id=4),
    Review(rating=8,
           review_text='good',
           customer_id=4,
           eatery_id=5),
    Review(rating=9,
           review_text='bloody scrumptious',
           customer_id=4,
           eatery_id=6),
    Review(rating=10,
           review_text='very good',
           customer_id=4,
           eatery_id=7),
    Review(rating=5,
           review_text='alright bland food',
           customer_id=2,
           eatery_id=8),
    Review(rating=5,
           review_text='alright bland food',
           customer_id=2,
           eatery_id=9),
    Review(rating=5,
           review_text='alright bland food',
           customer_id=2,
           eatery_id=10),
    Review(rating=5,
           review_text='good food',
           customer_id=1,
           eatery_id=11),
    Review(rating=5,
           review_text='bad food',
           customer_id=1,
           eatery_id=12),
    Review(rating=5,
           review_text='bad food',
           customer_id=1,
           eatery_id=13),
    Review(rating=8,
           review_text='scrumdiddlydocious',
           customer_id=1,
           eatery_id=14),
    Review(rating=8,
           review_text='i mean its alright',
           customer_id=3,
           eatery_id=15),
    Review(rating=8,
           review_text='i mean its alright',
           customer_id=3,
           eatery_id=16),
    Review(rating=8,
           review_text='i mean its alright',
           customer_id=3,
           eatery_id=17),
    Review(rating=9,
           review_text='alright',
           customer_id=4,
           eatery_id=18),
    Review(rating=1,
           review_text='bloody awful',
           customer_id=4,
           eatery_id=19),
    Review(rating=1,
           review_text='awful',
           customer_id=4,
           eatery_id=20),
]

voucher_arr=[
    Voucher(
            description="50 percent off",
            eatery=1,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="20 percent off",
            eatery=2,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="30 percent off",
            eatery=3,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="10 percent off",
            eatery=4,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="60 percent off",
            eatery=5,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="70 percent off",
            eatery=6,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="80 percent off",
            eatery=7,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="70 percent off",
            eatery=8,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="90 percent off",
            eatery=9,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="45 percent off",
            eatery=10,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="55 percent off",
            eatery=11,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="65 percent off",
            eatery=12,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="75 percent off",
            eatery=13,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="85 percent off",
            eatery=14,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="25 percent off",
            eatery=15,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="5 percent off",
            eatery=16,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="65 percent off",
            eatery=17,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="24 percent off",
            eatery=18,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="27 percent off",
            eatery=19,
            expiry=datetime.datetime(2024,12,12)),
    Voucher(
            description="37 percent off",
            eatery=20,
            expiry=datetime.datetime(2024,12,12)),
]

has_voucher_arr=[
    HasVoucher(
            user_id=1,
            voucher_id=1),
    HasVoucher(
            user_id=2,
            voucher_id=2),
    HasVoucher(
            user_id=3,
            voucher_id=3),
    HasVoucher(
            user_id=4,
            voucher_id=4),
]

if __name__ == '__main__':
    app = create_app(config_name='testing')
    with app.app_context():
        for eatery in eatery_arr:
            db.session.add(eatery)
            db.session.commit()
        for cuisine in cuisine_arr:
            db.session.add(cuisine)
            db.session.commit()
        for cooks_cuisine in cooks_cuisine_arr:
            db.session.add(cooks_cuisine)
            db.session.commit()
        for review in reviews_arr:
            db.session.add(review)
            db.session.commit()
        for customer in customers_arr:
            db.session.add(customer)
            db.session.commit()
        for voucher in voucher_arr:
            db.session.add(voucher)
            db.session.commit()
        for has_voucher in has_voucher_arr:
            db.session.add(has_voucher)
            db.session.commit()