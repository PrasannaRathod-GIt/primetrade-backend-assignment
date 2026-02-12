"""Authentication request/response schemas."""

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """User registration schema."""
    
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    """User login schema."""
    
    email: EmailStr
    password: str


class Token(BaseModel):
    """Token response schema."""
    
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """JWT token payload schema."""
    
    sub: str
    exp: int
