from django.db import models


class MeasurementTypes(models.TextChoices):
    Imperial = "imperial"
    Metric = "metric"
