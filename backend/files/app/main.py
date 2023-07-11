from flask import Flask
from budgetapp.extensions import db
from budgetapp.models.user import User
import os

# Retrieve environment variable values
mysql_user = os.getenv('MYSQL_USER')
mysql_password = os.getenv('MYSQL_PASSWORD')
mysql_host = os.getenv('MYSQL_HOST')
mysql_port = os.getenv('MYSQL_PORT')
mysql_database = os.getenv('MYSQL_DATABASE')

# Database configuration
SQLALCHEMY_DATABASE_URI = f"mysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_database}"

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI

db.init_app(app)

@app.cli.command('db_create')
def db_create():
    db.create_all()
    print('Database created!')

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"