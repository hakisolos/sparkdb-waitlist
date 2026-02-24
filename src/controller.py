from src.classes.user import User
from src.config.db import conndb
from src.helpers.mail import mail_service

from dotenv import load_dotenv

load_dotenv()


def Home():
    return {"message": "API service running"}


def joinWaitlist(user: User):
    conn = conndb()
    if not conn:
        return {"error": "Database connection failed"}

    try:
        with conn.cursor() as db:
            db.execute("SELECT 1 FROM users WHERE email = %s", (user.email,))
            if db.fetchone():
                return {"error": "This email has already joined the waitlist"}

            db.execute(
                "INSERT INTO users (email, fullname) VALUES (%s, %s)",
                (user.email, user.fullname)
            )

        conn.commit()
        mail_service.send_mail(user.email)

        return {"message": f"Successfully Joined Waitlist {user.fullname}"}

    except Exception as e:
        conn.rollback()
        return {"error": f"An error occurred: {e}"}

    finally:
        conn.close()


def getWaiters():
    conn = conndb()
    if not conn:
        return {"error": "Database connection failed"}

    try:
        with conn.cursor() as db:
            db.execute("SELECT email, fullname FROM users")
            rows = db.fetchall()

        if not rows:
            return {"error": "No Users Joined Yet"}

        return {"users": rows}

    except Exception as e:
        return {"error": f"An error occurred: {e}"}

    finally:
        conn.close()