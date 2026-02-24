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
<body style="margin:0; padding:0; background-color:#0a0a0a; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a; padding:48px 0;">
    <tr>
      <td align="center">

        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; background-color:#111111; border-radius:8px; border:1px solid #222222;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <span style="font-size:15px; font-weight:700; color:#ffffff; letter-spacing:-0.2px;">Spark DB</span>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px; background-color:#1e1e1e;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">

              <h1 style="margin:0 0 20px; font-size:22px; font-weight:600; color:#ffffff; line-height:1.3; letter-spacing:-0.4px;">
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

          <!-- CTA -->
          <tr>
            <td style="padding:0 48px 40px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#1d4ed8; border-radius:6px;">
                    <a href="#" style="display:inline-block; padding:11px 22px; font-size:14px; font-weight:500; color:#ffffff; text-decoration:none; letter-spacing:-0.1px;">
                      Learn more about Spark DB →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px; background-color:#1e1e1e;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 48px;">
              <p style="margin:0 0 4px; font-size:13px; color:#444444;">The Spark DB Team</p>
              <p style="margin:0; font-size:13px; color:#333333;">
                <a href="#" style="color:#333333; text-decoration:underline;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="#" style="color:#333333; text-decoration:underline;">Privacy</a>
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