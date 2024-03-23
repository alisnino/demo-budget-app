# save this as app.py
from flask import Flask
from routes import auth
from db import db
from flask_migrate import Migrate
from models import user, transaction, transaction_category
import os

# use os.environ.get to obtain hostname, username, password, and database name
hostname = os.environ.get("DB_HOSTNAME")
username = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")
database = os.environ.get("DB_NAME")

def create_app(test_config=None):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{username}:{password}@{hostname}/{database}"
    db.init_app(app)
    Migrate(app, db)

    app.register_blueprint(auth.auth_bp)
    
    return app
