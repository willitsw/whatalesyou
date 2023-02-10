from rest_framework import serializers

from .models import BrewSetting


class BrewSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrewSetting
        fields = "__all__"
