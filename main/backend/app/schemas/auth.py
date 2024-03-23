from pydantic import BaseModel

class SignUpRequestSchema(BaseModel):
    username: str
    email: str

# Only status code needed for SignUpResponse
    
class VerifyAccountRequestSchema(BaseModel):
    username: str
    email: str
    verification_code: str

# Only status code needed for VerifyAccountResponse
    
class LoginRequestSchema(BaseModel):
    email: str
    password: str

class LoginResponseSchema(BaseModel):
    access_token: str
