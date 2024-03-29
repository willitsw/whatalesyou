import random
import string

from django.core.mail import send_mail

from user.models import AUTOMATION_PREFIX, User


def send_new_user_email(email: str, first_name: str, verification_code: str) -> None:
    send_mail(
        f"{first_name}, Welcome to WhatAlesYou!",
        f"We are excited you joined. Your verification code is {verification_code}. Please enter that code to verify your email address.",
        "noreply@whatalesyou.net",
        [email],
        fail_silently=False,
    )


def reset_verification_code(
    email: str, first_name: str, verification_code: str
) -> None:
    send_mail(
        f"{first_name},",
        f"Your verification code for WhatAlesYou is reset. The new code is {verification_code}. Please enter that code to verify your email address.",
        "noreply@whatalesyou.net",
        [email],
        fail_silently=False,
    )


def send_forgot_password_email(
    email: str, first_name: str, verification_code: str
) -> None:
    send_mail(
        "WhatAlesYou Forgot Password",
        f"Dear {first_name}, Your verification code is {verification_code}. Please enter that code on the website to reset your password.",
        "noreply@whatalesyou.net",
        [email],
        fail_silently=False,
    )


def generate_verification_code(user: User) -> str:
    if user.email.startswith(AUTOMATION_PREFIX):
        return "ABCDE"
    return "".join(random.choices(string.ascii_uppercase, k=5))
