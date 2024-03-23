from pydantic import BaseModel

class SignUpRequestSchema(BaseModel):
    username: str
    email: str
    password: str

# Only status code needed for SignUpResponse
    
class VerifyAccountRequestSchema(BaseModel):
    username: str
    verification_code: str

# Only status code needed for VerifyAccountResponse
    
class LoginRequestSchema(BaseModel):
    username: str
    password: str

# Only status code needed for LoginResponse