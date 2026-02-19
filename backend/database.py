from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
import ssl

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./catering.db")

# Handle postgres:// or postgresql:// from Vercel/Supabase
# We enforce pg8000 driver because we pass a Python ssl_context object
if SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.strip()
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1)
    elif SQLALCHEMY_DATABASE_URL.startswith("postgresql://") and "+" not in SQLALCHEMY_DATABASE_URL.split("://")[0]:
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)

# For SQLite, use check_same_thread=False. For Postgres (Supabase), use SSL context.
engine_args = {}
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine_args["connect_args"] = {"check_same_thread": False}
else:
    # Supabase requires SSL. pg8000 needs an SSLContext object.
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    engine_args["connect_args"] = {"ssl_context": ssl_context}

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
