from flask import request, session, make_response
from logger import logger

from db import db
from models.user import User

from . import auth_bp
from schemas.auth import SignUpRequestSchema, VerifyAccountRequestSchema, LoginRequestSchema

from aws.cognito import create_user, login_user, verify_user, verify_jwt_token

@auth_bp.route('/', methods=['GET'])
def session_check():
    if not session:
        return {'message': 'Unauthorized'}, 401
    if not session.get('user_id'):
        return {'message': 'Unauthorized'}, 401
    return {'message': 'User is logged in'}, 200

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        inputs = SignUpRequestSchema.model_validate(request.json)
    except ValueError as e:
        return {'message': 'Bad request'}, 400
    
    username = inputs.username
    email = inputs.email
    password = inputs.password

    try:
        create_user(email, username, password)
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return {'message': 'Failed to create user'}, 500
    
    return {'message': 'User signed up successfully'}, 200

@auth_bp.route('/verify', methods=['POST'])
def verifyaccount():
    try:
        inputs = VerifyAccountRequestSchema.model_validate(request.json)
    except ValueError as e:
        return {'message': 'Bad request'}, 400
    
    username = inputs.username
    verification_code = inputs.verification_code

    try:
        verify_user(username, verification_code)
        db.session.add(User(username=username))
        db.session.commit()

    except Exception as e:
        logger.error(f"Verification failed: {e}")
        return {'message': 'Verification code is incorrect.'}, 500
    return {'message': 'User account verified successfully'}, 200


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        inputs = LoginRequestSchema.model_validate(request.json)
    except ValueError as e:
        return {'message': 'Bad request'}, 400
    
    username = inputs.username
    password = inputs.password

    try:
        cognito_response = login_user(username, password)
        access_token = cognito_response['AuthenticationResult']['AccessToken']
        decoded_token = verify_jwt_token(access_token)
        user = User.query.filter_by(username=decoded_token['username']).first()
        if not user:
            return {'message': 'User does not exist'}, 500
        session['user_id'] = user.id
        session["username"] = user.username
    except Exception as e:
        logger.error(f"Login failed for user {username}: {e}")
        return {'message': 'Username or password is incorrect.'}, 500
    response = make_response({'message': 'User logged in successfully'}, 200)
    response.set_cookie('session_id', session.sid, httponly=True)
    return response