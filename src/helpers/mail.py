import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()


user = os.getenv("APP_MAIL")
password = os.getenv("APP_MAIL_PASSWORD")
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

def sendMail(recipient, subject="Spark DB Waitlist Confirmation"):
    try:
       
        html_body = """
        <html>
        <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#000000; color:#ffffff;">
            <div style="max-width:600px; margin:30px auto; padding:20px; background-color:#0d1117; border-radius:10px; border:2px solid #1e40af;">
                <h2 style="color:#1e40af; text-align:center;">Thank You for Joining the Spark DB Waitlist!</h2>
                <p style="font-size:16px; line-height:1.5; text-align:center;">
                    We're thrilled to have you on board. If anything happens, you'll be the <strong>first to know</strong>.
                </p>
                <div style="text-align:center; margin-top:30px;">
                    <span style="color:#1e40af; font-weight:bold;">– The Spark DB Team</span>
                </div>
            </div>
        </body>
        </html>
        """

      
        msg = MIMEMultipart()
        msg['From'] = user
        msg['To'] = recipient
        msg['Subject'] = subject
        msg.attach(MIMEText(html_body, 'html'))

     
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(user, password)
        server.send_message(msg)
        server.quit()

        print(f"Waitlist confirmation email sent to {recipient} successfully.")
    except Exception as e:
        print(f"Failed to send email: {e}")