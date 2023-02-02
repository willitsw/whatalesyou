from django.db import models
from user_profiles.models import UserProfile
import datetime


class RecipeTypes(models.TextChoices):
    Other = "other"
    Extract = "extract"
    Partial_Mash = "partial_mash"
    All_Grain = "all_grain"


class MeasurementTypes(models.TextChoices):
    Imperial = "imperial"
    Metric = "metric"


class IngredientSteps(models.TextChoices):
    StrikeWater = "strikewater"
    Mash = "mash"
    Boil = "boil"
    Fermentor = "fermentor"
    Bottle = "bottle"


class IngredientAmountTypes(models.TextChoices):
    Gram = "g"
    Ounce = "oz"
    Kilogram = "kg"
    Pound = "lb"
    Each = "each"


class Recipe(models.Model):
    name = models.CharField(max_length=200, default="")
    type = models.CharField(
        max_length=20, choices=RecipeTypes.choices, default=RecipeTypes.All_Grain
    )
    description = models.TextField(default="")
    author = models.CharField(max_length=100, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    batch_size = models.FloatField(default=5)
    efficiency = models.FloatField(default=65)
    measurement_type = models.CharField(
        max_length=10,
        choices=MeasurementTypes.choices,
        default=MeasurementTypes.Imperial,
    )

    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.owner.user.email} - {self.created_at.strftime('%d/%m/%Y')}"


class IngredientMixin(models.Model):
    name = models.CharField(max_length=200)
    step = models.CharField(max_length=20, choices=IngredientSteps.choices)
    timing = models.FloatField()
    notes = models.TextField()
    amount = models.FloatField()
    amount_type = models.CharField(max_length=5, choices=IngredientAmountTypes.choices)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{__name__} {self.name} - {self.amount} {self.amount_type}"


class FermentableTypes(models.TextChoices):
    Other = "other"
    Liquid_Extract = "liquid_extract"
    Dry_Extract = "dry_extract"
    Grain = "grain"
    Sugar = "sugar"
    Fruit = "fruit"
    Juice = "juice"
    Honey = "honey"


class Fermentable(IngredientMixin):
    lovibond = models.FloatField()
    type = models.CharField(max_length=20, choices=FermentableTypes.choices)
    potential = models.FloatField()
    recipe = models.ForeignKey(
        Recipe, related_name="fermentables", on_delete=models.CASCADE
    )


class Chemistry(IngredientMixin):
    recipe = models.ForeignKey(
        Recipe, related_name="chemistry", on_delete=models.CASCADE
    )


class Hop(IngredientMixin):
    alpha_acid = models.FloatField()
    recipe = models.ForeignKey(Recipe, related_name="hops", on_delete=models.CASCADE)


class CultureForm(models.TextChoices):
    Liquid = "liquid"
    Dry = "dry"


class Culture(IngredientMixin):
    attenuation = models.FloatField()
    form = models.CharField(max_length=10, choices=CultureForm.choices)
    recipe = models.ForeignKey(
        Recipe, related_name="cultures", on_delete=models.CASCADE
    )


class NonFermentable(IngredientMixin):
    recipe = models.ForeignKey(
        Recipe, related_name="non_fermentables", on_delete=models.CASCADE
    )
