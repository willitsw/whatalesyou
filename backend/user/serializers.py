from rest_framework import serializers

from brew_settings.serializers import BrewSettingSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    settings = BrewSettingSerializer()

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "is_staff", "settings"]


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "password"]


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name"]
