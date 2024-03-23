import os
import boto3

cognito_user_pool = os.getenv('COGNITO_USER_POOL_ID')
aws_default_region = os.getenv('AWS_DEFAULT_REGION')

cognito = boto3.client('cognito-idp', region_name=aws_default_region)

def create_user(email, username):
    try:
        response = cognito.admin_create_user(
            UserPoolId=cognito_user_pool,
            Username=username,
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
