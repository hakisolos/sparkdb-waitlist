import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

APP_MAIL = os.getenv("APP_MAIL")
APP_MAIL_PASSWORD = os.getenv("APP_MAIL_PASSWORD")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465  # SSL port

class MailService:
    def __init__(self):
        self.server = None

    def connect(self):
        if self.server is None:
            self.server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
            self.server.login(APP_MAIL, APP_MAIL_PASSWORD)

    def send_mail(self, recipient, subject="Spark DB Waitlist Confirmation"):
        try:
            self.connect()

            html_body = """
            <html>
            <body style="margin:0; padding:0; background-color:#0a0a0a; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a; padding:48px 0;">
                <tr>
                  <td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; background-color:#111111; border-radius:8px; border:1px solid #222222;">

                      <tr>
                        <td style="padding:40px 48px 32px;">
                          <span style="font-size:15px; font-weight:700; color:#ffffff;">Spark DB</span>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:0 48px;">
                          <div style="height:1px; background-color:#1e1e1e;"></div>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:40px 48px 32px;">
                          <h1 style="margin:0 0 20px; font-size:22px; font-weight:600; color:#ffffff;">
                            You're on the waitlist.
                          </h1>
                          <p style="margin:0 0 16px; font-size:15px; line-height:1.65; color:#888888;">
                            Thanks for signing up. We'll reach out as soon as early access opens — you'll be among the first in.
                          </p>
                          <p style="margin:0; font-size:15px; line-height:1.65; color:#888888;">
                            In the meantime, if you have questions just reply to this email.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """

            msg = MIMEMultipart("alternative")
            msg["From"] = APP_MAIL
            msg["To"] = recipient
            msg["Subject"] = subject
            msg.attach(MIMEText(html_body, "html"))

            self.server.send_message(msg)
            print(f"Email sent to {recipient}")

        except Exception as e:
            print(f"Failed to send email: {e}")

    def close(self):
        if self.server:
            self.server.quit()
            self.server = None


# Create a single reusable instance
mail_service = MailService()