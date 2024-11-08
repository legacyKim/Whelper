import os
import smtplib
from dotenv import load_dotenv

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

load_dotenv()


def send_email(recipient_email, certify_num):

    sender_email = os.getenv('MY_EMAIL')
    sender_password = os.getenv('MY_EMAIL_PASSWORD')

    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)

        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = recipient_email
        msg["Subject"] = "인증번호 확인"

        body = f"안녕하세요! 인증번호는 {certify_num} 입니다."
        msg.attach(MIMEText(body, "plain"))

        server.sendmail(sender_email, recipient_email, msg.as_string())

    except Exception as e:
        print(f"이메일 전송 실패: {e}")

    finally:
        server.quit()
