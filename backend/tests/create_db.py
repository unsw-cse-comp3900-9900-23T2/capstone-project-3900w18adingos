import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from app import create_app, db
from app.models.eatery import Eatery

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
]

if __name__ == '__main__':
    app = create_app(config_name='testing')
    with app.app_context():
        for eatery in eatery_arr:
            db.session.add(eatery)
            db.session.commit()