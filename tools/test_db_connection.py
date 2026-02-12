"""Test Supabase PostgreSQL connection with verbose error output."""
import traceback

# Test 1: Raw psycopg2 connection
print("=" * 60)
print("TEST 1: Raw psycopg2 connection (port 5432)")
print("=" * 60)
try:
    import psycopg2
    conn = psycopg2.connect(
        host="db.tkaajkabuelfvriggnef.supabase.co",
        port=5432,
        database="postgres",
        user="postgres",
        password="ojaswin@2004",
        sslmode="require",
        connect_timeout=10
    )
    cur = conn.cursor()
    cur.execute("SELECT version()")
    print(f"SUCCESS! Version: {cur.fetchone()[0]}")
    conn.close()
except Exception as e:
    print(f"FAILED: {type(e).__name__}: {e}")
    traceback.print_exc()

# Test 2: Try pooler port 6543
print()
print("=" * 60)
print("TEST 2: Raw psycopg2 connection (port 6543 - pooler)")
print("=" * 60)
try:
    import psycopg2
    conn = psycopg2.connect(
        host="db.tkaajkabuelfvriggnef.supabase.co",
        port=6543,
        database="postgres",
        user="postgres",
        password="ojaswin@2004",
        sslmode="require",
        connect_timeout=10
    )
    cur = conn.cursor()
    cur.execute("SELECT version()")
    print(f"SUCCESS! Version: {cur.fetchone()[0]}")
    conn.close()
except Exception as e:
    print(f"FAILED: {type(e).__name__}: {e}")
    traceback.print_exc()

# Test 3: Try the transaction pooler endpoint
print()
print("=" * 60)
print("TEST 3: Pooler endpoint (aws-0-ap-south-1)")
print("=" * 60)
try:
    import psycopg2
    conn = psycopg2.connect(
        host="aws-0-ap-south-1.pooler.supabase.com",
        port=6543,
        database="postgres",
        user="postgres.tkaajkabuelfvriggnef",
        password="ojaswin@2004",
        sslmode="require",
        connect_timeout=10
    )
    cur = conn.cursor()
    cur.execute("SELECT version()")
    print(f"SUCCESS! Version: {cur.fetchone()[0]}")
    conn.close()
except Exception as e:
    print(f"FAILED: {type(e).__name__}: {e}")
    traceback.print_exc()
