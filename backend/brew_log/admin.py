from django.contrib import admin
from .models import BrewLog, GravityReading

admin.site.register(BrewLog)
admin.site.register(GravityReading)
