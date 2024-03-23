from flask import request
from . import auth_bp
from logger import logger
from schemas.auth import SignUpRequestSchema, VerifyAccountRequestSchema, LoginRequestSchema, LoginResponseSchema

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        inputs = SignUpRequestSchema.model_validate(request.json)
    except ValueError as e:
        return {'message': 'Bad request'}, 400
    
    username = inputs.username
    email = inputs.email

    logger.info(f"Received signup request for username: {username}, email: {email}")
    return {'message': 'User signed up successfully'}, 200

@auth_bp.route('/verify', methods=['POST'])
def verifyaccount():
    try:
        inputs = VerifyAccountRequestSchema.model_validate(request.json)
    except ValueError as e:
        return {'message': 'Bad request'}, 400
    
    username = inputs.username
    email = inputs.email
    verification_code = inputs.verification_code

    logger.info(f"Received verification account request for username: {username}, email: {email}, verification code: {verification_code}")
    return {'message': 'User account verified successfully'}, 200


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        inputs = LoginRequestSchema.model_validate(request.json)
    except ValueError as e:
        return {'message': 'Bad request'}, 400
    
    email = inputs.email
    password = inputs.password

    logger.info(f"Received login request for email: {email}")
    return LoginResponseSchema(access_token="hi").model_dump(), 200
