from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(
        self, email=None, password=None, is_admin=False, is_staff=False, is_active=True
    ):
        if not email:
            raise ValueError("User must have an email")
        if not password:
            raise ValueError("User must have a password")

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)  # change password to hash
        user.admin = is_admin
        user.staff = is_staff
        user.active = is_active
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, password=None):
        user = self.create_user(
            email,
            password=password,
            is_staff=True,
        )
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(
            email=email,
            password=password,
            is_staff=True,
            is_admin=True,
        )
        return user


class User(AbstractUser):
    bio = models.TextField(max_length=500, blank=True, null=True)
    email = models.EmailField(unique=True)
    username = models.CharField(
        max_length=150,
        blank=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_username(self):
        return self.email

    def __str__(self):
        return f"{self.pk} {self.email}"

    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"
