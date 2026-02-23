import psycopg
import os




def conndb():
    try:
        conn = psycopg.connect(os.getenv("CSTRING"))
        return conn
    except Exception as e:
        print(f"an error occure: {e}")
        return None
    
