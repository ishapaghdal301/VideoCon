from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

mail = Mail()
load_dotenv()
def send_email(to, subject, body):
    try:
        mail_server = os.getenv('MAIL_SERVER')
        mail_port = int(os.getenv('MAIL_PORT'))
        mail_use_tls = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
        mail_username = os.getenv('MAIL_USERNAME')
        mail_password = os.getenv('MAIL_PASSWORD')
        mail_default_sender = os.getenv('MAIL_DEFAULT_SENDER')

        mail.server = (mail_server, mail_port)
        mail.use_tls = mail_use_tls
        mail.username = mail_username
        mail.password = mail_password
        mail.default_sender = mail_default_sender

        message = Message(subject=subject, recipients=[to], body=body)

        with mail.connect() as conn:
            conn.send(message)

        return True
    except Exception as e:
        print('Error sending email:', str(e))
        return False
