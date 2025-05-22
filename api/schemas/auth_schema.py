from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    major: str
    password: str

class UserSignin(BaseModel):
    email: EmailStr | str
    password: str
    remember: bool