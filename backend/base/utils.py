import os
import re
import random
import string

from datetime import datetime


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
