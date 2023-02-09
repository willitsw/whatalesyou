from django.contrib.auth.models import User
from django.db import models


class UserProfile(User):
    bio = models.TextField(max_length=500, blank=True, null=True)

    USERNAME_FIELD = "email"

    def __str__(self):
        return f"{self.pk} {self.email}"
