# save this as app.py
from flask import Flask
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
    
    @app.route("/")
    def hello():

      users = db.session.execute(db.select(user.User)).scalars().all()

      names = ""  
      for u in users:
        names += u.name + ", "
      names = names[:-2]

      # Replace last comma with "and"
      names = names[::-1].replace(",", "dna ", 1)[::-1]

      return "Hi, " + str(names) + "!"
    
    return app