from django.db import models
from django.db.models.signals import post_save

from shared.models import MeasurementTypes
from user.models import User


# Create your models here.
class BrewSetting(models.Model):
    owner = models.OneToOneField(
        User, related_name="settings", on_delete=models.CASCADE
    )
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

    @classmethod
    def on_user_create(self, sender, instance, created, *args, **kwargs):
        if not created:
            return
        self.objects.create(owner=instance)

    def __str__(self):
        return f"{self.pk} {self.owner.email}"


post_save.connect(BrewSetting.on_user_create, sender=User)
