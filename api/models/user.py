from sqlalchemy import Boolean, Table, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db import metadata

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("username", String, unique=True, nullable=False),
    Column("email", String, unique=True, nullable=False),
    Column("password", String, nullable=False),
    Column("major", String, nullable=False),
    Column("blocked", Boolean, default=False),
    Column("created_at", DateTime, server_default=func.now(), nullable=False)
)