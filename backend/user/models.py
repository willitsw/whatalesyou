from django.contrib.auth.models import User
from django.db import models

from shared.models import MeasurementTypes


class UserProfile(User):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True, null=True)
    measurement_type = models.TextField(
        max_length=10,
        choices=MeasurementTypes.choices,
        default=MeasurementTypes.Imperial,
    )
    batch_size = models.FloatField(default=5)
    boil_time = models.FloatField(default=60)
    brewhouse_efficiency = models.FloatField(default=65)
    water_loss_per_grain_unit = models.FloatField(default=0.5)
    water_loss_fermentor_trub = models.FloatField(default=0.25)
    water_loss_kettle_trub = models.FloatField(default=0.25)
    water_loss_per_boil_unit = models.FloatField(default=1.5)
    do_sparge = models.BooleanField(default=False)
    mash_thickness_target = models.FloatField(default=1.3)

    def __str__(self):
        return f"{self.pk} {self.user.email}"
