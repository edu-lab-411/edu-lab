from fastapi import HTTPException, Header
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from models.user import users
from db import database

from dotenv import load_dotenv
import os
load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Password hashing
def hash_password(password: str):
    return pwd_context.hash(password)

# Password verification
def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

# JWT token
def create_token(data: str, expires: int):
    expire = datetime.now().astimezone() + timedelta(minutes=expires)
    return jwt.encode(
        {
            "sub": data,
            "exp": expire,
            "iat": datetime.now().astimezone()
        }, 
        os.getenv("SECRET_KEY"),
        "HS256"
    )

# Verify user token
async def verify_and_get_user(token: str):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        # Check token expiration
        exp_timestamp = payload.get("exp")
        if exp_timestamp:
            exp = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
            if exp < datetime.now(timezone.utc):
                raise HTTPException(status_code=401, detail="Token has expired")

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        user_id = user_id.split("LPSDOIOUAOPEUY")[0]
        # Check if user exists in DB
        query = select(users).where(users.c.id == int(user_id))
        result = await database.execute(query)
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        return result

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
# Middleware for authentication
async def auth_required(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")
    token = authorization.split("Bearer ")[1]
    user = await verify_and_get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user