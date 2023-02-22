import uuid

from django.db import models


class WhatAlesYouBaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class MeasurementTypes(models.TextChoices):
    Imperial = "imperial"
    Metric = "metric"
