import os
import sys
from sqlalchemy import create_engine, text

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.engine import URL

url_object = URL.create(
    "postgresql",
    username="postgres",
    password="ojaswin@2004",  # Plain password, URL.create handles encoding
    host="db.tkaajkabuelfvriggnef.supabase.co",
    port=5432,
    database="postgres",
    query={"sslmode": "require"}
)
DATABASE_URL = url_object

def test_connection():
    try:
        print(f"Connecting to: {DATABASE_URL}")
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            print("Connection Successful!")
            print(f"Version: {result.fetchone()[0]}")
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_connection()
