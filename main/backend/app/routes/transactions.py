from flask import session
from models.transaction import Transaction

from . import transactions_bp

@transactions_bp.route('/', methods=['GET'])
def get_transactions():
    current_user_id = session.get('user_id')
    try:
        transactions = Transaction.query.filter_by(user_id=current_user_id).all()
    except Exception as e:
        return {'message': "Failed to retrieve transactions"}, 500
    return {'transactions': [t.to_dict() for t in transactions]}, 200
