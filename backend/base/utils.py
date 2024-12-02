import os
import re
import random
import string
from twilio.rest import Client
from backend.production_settings import *
from datetime import datetime
from booking.models import Booking


def update_completed_bookings():
    current_date = datetime.now()
    current_datetime = current_date.time()

    bookings_to_update = Booking.objects.filter(
        booking_date__lt=current_date,
        booking_status__in=[Booking.CONFIRMED],
        slot__start_time__lt=current_datetime)

    for booking in bookings_to_update:
        booking.booking_status = 4
        booking.save()

def create_directory(directory_path):
    """Create a directory if it doesn't exist."""
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)


def generate_password():
    """Create a random string of six digit password with numbers and alphabets"""
    allowed_chars = string.ascii_letters + string.digits

    return ''.join(random.choice(allowed_chars) for _ in range(6))


def get_current_timestamp():
    """Return the current timestamp."""
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def sanitize_string(s):
    """Sanitize a string by removing non-alphanumeric characters."""
    return re.sub(r'\W+', '', s)


def validate_email(email):
    """Simple email validation."""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'

    return re.match(pattern, email) is not None

def send_coupon_whatsapp(phone_number, coupon_code, discount_percentage):

    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    
    message = client.messages.create(
        from_='whatsapp:+14155238886',
        body=f"Congratulations! You've received a coupon: {coupon_code}. Use it soon!",
        to=f'whatsapp:+91{phone_number}'
    )

    print(message.sid)
def send_coupon_sms(customer_phone, coupon_code):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    try:
        message = client.messages.create(
            body=f"Congratulations! You've received a coupon: {coupon_code}. Use it soon!",
            from_=TWILIO_PHONE_NUMBER,
            to=f"+91{customer_phone}",
        )
        return message.sid
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return None
