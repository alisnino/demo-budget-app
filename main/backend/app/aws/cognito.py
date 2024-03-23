import os
import boto3
from jose import jwt
import requests

cognito_user_pool = os.getenv('COGNITO_USER_POOL_ID')
cognito_client_id = os.getenv('COGNITO_CLIENT_ID')
aws_default_region = os.getenv('AWS_DEFAULT_REGION')

cognito = boto3.client('cognito-idp', region_name=aws_default_region)

def create_user(email, username, password):
    try:
        response = cognito.sign_up(
            ClientId=cognito_client_id,
            Username=username,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': email
                },
            ]
            
        )
    except Exception as e:
        raise e
    
    return response

def verify_user(username, verification_code):
    try:
        response = cognito.confirm_sign_up(
            ClientId=cognito_client_id,
            Username=username,
            ConfirmationCode=verification_code
        )
    except Exception as e:
        raise e
    
    return response

def login_user(username, password):
    try:
        initiate_auth_response = cognito.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": password
            },
            ClientId=cognito_client_id
        )
    except Exception as e:
        raise e
    
    return initiate_auth_response

def verify_jwt_token(token):
    cognito_verify_token_endpoint = f"https://cognito-idp.{aws_default_region}.amazonaws.com/{cognito_user_pool}/.well-known/jwks.json"
    response = requests.get(cognito_verify_token_endpoint)
    keys = response.json()['keys']

    try:
        unverified_header = jwt.get_unverified_header(token)
    except Exception:
        raise "Error reading token header"
    
    rsa_key = {}
    for key in keys:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }

    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=cognito_client_id
            )
        except jwt.exceptions.PyJWTError as e:
            raise jwt.exceptions.PyJWTError
        
        return payload
    return None
