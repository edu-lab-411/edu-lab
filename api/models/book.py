from sqlalchemy import Table, Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from db import metadata

book = Table(
    "books",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("book_name", String, unique=True, nullable=False),
    Column("book_category", String, nullable=False),
    Column("book_author", String, nullable=False),
    Column("book_cover", String, nullable=False),
    Column("created_at", DateTime, server_default=func.now(), nullable=False)
)