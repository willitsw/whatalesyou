# Generated by Django 4.1.5 on 2023-02-09 21:20

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("recipes", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="recipe",
            name="owner",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="recipes",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="nonfermentable",
            name="recipe",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="non_fermentables",
                to="recipes.recipe",
            ),
        ),
        migrations.AddField(
            model_name="hop",
            name="recipe",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="hops",
                to="recipes.recipe",
            ),
        ),
        migrations.AddField(
            model_name="fermentable",
            name="recipe",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="fermentables",
                to="recipes.recipe",
            ),
        ),
        migrations.AddField(
            model_name="culture",
            name="recipe",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="cultures",
                to="recipes.recipe",
            ),
        ),
        migrations.AddField(
            model_name="chemistry",
            name="recipe",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="chemistry",
                to="recipes.recipe",
            ),
        ),
    ]