import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'clau_secreta_servidor_recursos_v03')

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(
        os.path.dirname(__file__), 'data', 'database.db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt_clau_servidor_recursos_v03')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    SESSION_TIMEOUT_USER = 60
    SESSION_TIMEOUT_ADMIN = 3600

    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@mme.cat')
    MAGIC_CODE = os.environ.get('MAGIC_CODE', '123456')
