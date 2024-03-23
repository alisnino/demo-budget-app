from flask import request
from logger import logger

from db import db
from models.user import User

from . import auth_bp
from schemas.auth import SignUpRequestSchema, VerifyAccountRequestSchema, LoginRequestSchema, LoginResponseSchema

from aws.cognito import create_user, login_user, verify_user

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        inputs = SignUpRequestSchema.model_validate(request.json)
    except ValueError as e:
        return {'message': 'Bad request'}, 400
    
    username = inputs.username
    email = inputs.email
    password = inputs.password

    logger.info(f"Received signup request for username: {username}, email: {email}")
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

    logger.info(f"Received verification account request for username: {username}")
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

    logger.info(f"Received login request for user: {username}")
    try:
        cognito_response = login_user(username, password)
    except Exception as e:
        logger.error(f"Login failed: {e}")
        return {'message': 'Username or password is incorrect.'}, 500
    return LoginResponseSchema(access_token=cognito_response['AuthenticationResult']['AccessToken']).model_dump(), 200
