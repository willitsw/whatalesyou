from django.db import models

from shared.models import MeasurementTypes, WhatAlesYouBaseModel
from user.models import User


class RecipeTypes(models.TextChoices):
    Other = "other"
    Extract = "extract"
    Partial_Mash = "partial_mash"
    All_Grain = "all_grain"


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


class Recipe(WhatAlesYouBaseModel):
    name = models.CharField(max_length=200)
    type = models.CharField(
        max_length=20, choices=RecipeTypes.choices, default=RecipeTypes.All_Grain
    )
    description = models.TextField(blank=True, null=True)
    author = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    batch_size = models.FloatField(blank=True, null=True)
    efficiency = models.FloatField(blank=True, null=True)
    measurement_type = models.CharField(
        max_length=10,
        choices=MeasurementTypes.choices,
        default=MeasurementTypes.Imperial,
    )

    owner = models.ForeignKey(User, related_name="recipes", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id} {self.name} - {self.owner.email} - {self.created_at.strftime('%d/%m/%Y')}"


class IngredientMixin(WhatAlesYouBaseModel):
    name = models.CharField(max_length=200)
    step = models.CharField(max_length=20, choices=IngredientSteps.choices)
    timing = models.FloatField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    amount = models.FloatField()
    amount_type = models.CharField(max_length=5, choices=IngredientAmountTypes.choices)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.id} {self.name} - {self.amount} {self.amount_type}"


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
