from rest_framework import serializers

from .models import BrewLog, GravityReading


class GravityReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GravityReading
        fields = "__all__"


class BrewLogSerializer(serializers.ModelSerializer):
    gravity_readings = GravityReadingSerializer(many=True)

    class Meta:
        model = BrewLog
        fields = "__all__"
