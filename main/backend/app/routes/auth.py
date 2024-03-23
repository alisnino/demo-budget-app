from flask import request
from . import auth_bp
from logger import logger

@auth_bp.route('/signup', methods=['POST'])
def signup():
    # """
    # Endpoint to receive user signup information.
    # """
    user_info = request.json
    if not user_info:
        return {'error': 'No JSON data received'}, 400
    
    username = user_info.get('username')
    email = user_info.get('email')

    if not username or not email:
        return {'error': 'Username or email missing in request'}, 400

    logger.info(f"Received signup request for username: {username}, email: {email}")
    return {'message': 'User signed up successfully'}, 200
