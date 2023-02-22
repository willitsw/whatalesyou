from django.db import models

from recipes.models import Recipe
from shared.models import WhatAlesYouBaseModel
from user.models import User


class BrewLogStatuses(models.TextChoices):
    InProgress = "in_progress"
    Complete = "complete"


class BrewLog(WhatAlesYouBaseModel):
    name = models.CharField(max_length=200)
    batch_number = models.IntegerField(blank=True, null=True)
    status = models.CharField(
        max_length=12,
        choices=BrewLogStatuses.choices,
        default=BrewLogStatuses.InProgress,
    )
    brew_date = models.DateField(blank=True, null=True)
    secondary_date = models.DateField(blank=True, null=True)
    packaging_date = models.DateField(blank=True, null=True)
    brewing_notes = models.TextField(blank=True, null=True)
    fermentation_notes = models.TextField(blank=True, null=True)
    hop_notes = models.TextField(blank=True, null=True)
    yeast_notes = models.TextField(blank=True, null=True)
    packaging_notes = models.TextField(blank=True, null=True)
    tasting_notes = models.TextField(blank=True, null=True)
    other_notes = models.TextField(blank=True, null=True)

    recipe = models.ForeignKey(
        Recipe,
        related_name="brew_logs",
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
    )
    owner = models.ForeignKey(User, related_name="brew_logs", on_delete=models.CASCADE)

    def __str__(self):
        return (
            f"{self.name} - {self.owner.email} - {self.brew_date.strftime('%d/%m/%Y')}"
        )


class GravityReading(WhatAlesYouBaseModel):
    notes = models.CharField(max_length=200)
    gravity = models.FloatField()
    date = models.DateTimeField(auto_now=True)
    brew_log = models.ForeignKey(
        BrewLog, related_name="gravity_readings", on_delete=models.CASCADE
    )
