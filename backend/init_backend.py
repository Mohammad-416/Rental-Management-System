import time
import psycopg2
import os
from dotenv import load_dotenv

# Load .env file from root or backend folder
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

print("⏳ Waiting for DB...")

while True:
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("DB_HOST", "db"),
            port="5432"
        )
        conn.close()
        print("DB Ready!")
        break
    except psycopg2.OperationalError as e:
        print(f"DB not ready yet: {e}")
        time.sleep(1)