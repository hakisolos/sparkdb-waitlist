from src.classes.user import User
from src.config.db import conndb  
from src.helpers.mail import sendMail

from dotenv import load_dotenv

load_dotenv()


conn = conndb()



def Home():
    return {"message": "API service running"}

def joinWaitlist(user: User):
    try:
        with conn.cursor() as db: 
            
            db.execute("SELECT * FROM users WHERE email = %s", (user.email,))
            rows = db.fetchall()
            if rows:
                return {"error": "This email has already joined the waitlist"}
            db.execute(
                "INSERT INTO users (email, fullname) VALUES (%s, %s)",
                (user.email, user.fullname)
            )
            conn.commit()
            sendMail(user.email)
        return {"message": f"Successfully Joined Waitlist {user.fullname}"}
    except Exception as e:
        print(e)
        return {"error": f"An error occurred: {e}"}