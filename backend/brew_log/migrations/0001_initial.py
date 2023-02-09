# Generated by Django 4.1.5 on 2023-02-03 01:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("user_profiles", "0002_userprofile_batch_size_userprofile_boil_time_and_more"),
        ("recipes", "0003_alter_chemistry_notes_alter_chemistry_timing_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="BrewLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                ("batch_number", models.IntegerField(blank=True, null=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("in_progress", "Inprogress"),
                            ("complete", "Complete"),
                        ],
                        default="in_progress",
                        max_length=12,
                    ),
                ),
                ("brew_date", models.DateField(auto_now_add=True)),
                ("secondary_date", models.DateField(blank=True, null=True)),
                ("packaging_date", models.DateField(blank=True, null=True)),
                ("brewing_notes", models.TextField(blank=True, null=True)),
                ("fermentation_notes", models.TextField(blank=True, null=True)),
                ("hop_notes", models.TextField(blank=True, null=True)),
                ("yeast_notes", models.TextField(blank=True, null=True)),
                ("packaging_notes", models.TextField(blank=True, null=True)),
                ("tasting_notes", models.TextField(blank=True, null=True)),
                ("other_notes", models.TextField(blank=True, null=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="brew_logs",
                        to="user_profiles.userprofile",
                    ),
                ),
                (
                    "recipe",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="brew_logs",
                        to="recipes.recipe",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="GravityReading",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("notes", models.CharField(max_length=200)),
                ("gravity", models.FloatField()),
                ("date", models.DateTimeField(auto_now=True)),
                (
                    "brew_log",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="gravity_readings",
                        to="brew_log.brewlog",
                    ),
                ),
            ],
        ),
    ]
