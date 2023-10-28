from django.core.mail import send_mail


def send_new_hire_email(email: str, first_name: str) -> None:
    send_mail(
        f"{first_name}, Welcome to WhatAlesYou!",
        "We are excited to have you. Please visit http://whatalesyou.net to get started!",
        "noreply@whatalesyou.net",
        [email],
        fail_silently=False,
    )
