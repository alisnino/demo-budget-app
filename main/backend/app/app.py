# save this as app.py
from flask import Flask, request, session
from flask_migrate import Migrate
from flask_session import Session
from flask_cors import CORS
from routes import auth, transactions, health
from db import db
from models import user, transaction, transaction_category

import os

# use os.getenv to obtain hostname, username, password, and database name
hostname = os.getenv("DB_HOSTNAME")
username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
database = os.getenv("DB_NAME")

def create_app(test_config=None):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{username}:{password}@{hostname}/{database}"
    app.config['SESSION_TYPE'] = 'sqlalchemy'
    app.config['SESSION_SQLALCHEMY'] = db
    app.config['SESSION_SQLALCHEMY_TABLE'] = 'sessions'
    app.config['SESSION_COOKIE_NAME'] = 'session_id'
    app.config['PERMANENT_SESSION_LIFETIME'] = 3 * 24 * 60 * 60
    if os.getenv("FLASK_ENV") == 'development':
        app.config['SESSION_COOKIE_DOMAIN'] = ""
        CORS(app, supports_credentials=True)
    else:
        CORS(app, supports_credentials=True, origins=os.getenv("FRONTEND_URL"))

    db.init_app(app)
    Migrate(app, db)
    
    sess = Session()
    sess.init_app(app)

    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(transactions.transactions_bp)
    app.register_blueprint(health.health_bp)

    @app.before_request
    def before_request():
        excluded_routes = ['/auth', '/health']
        for prefix in excluded_routes:
            if request.path.startswith(prefix):
                return
        if not session:
            return {'message': 'Unauthorized'}, 401
        if not session.get('user_id'):
            return {'message': 'Unauthorized'}, 401
    
    return app
