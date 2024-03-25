from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
transactions_bp = Blueprint('transactions', __name__, url_prefix='/transactions')
health_bp = Blueprint('health', __name__, url_prefix='/health')

from . import auth, transactions, health