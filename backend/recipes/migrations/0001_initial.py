# Generated by Django 4.1.5 on 2023-02-09 21:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Chemistry",
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
                (
                    "step",
                    models.CharField(
                        choices=[
                            ("strikewater", "Strikewater"),
                            ("mash", "Mash"),
                            ("boil", "Boil"),
                            ("fermentor", "Fermentor"),
                            ("bottle", "Bottle"),
                        ],
                        max_length=20,
                    ),
                ),
                ("timing", models.FloatField(blank=True, null=True)),
                ("notes", models.TextField(blank=True, null=True)),
                ("amount", models.FloatField()),
                (
                    "amount_type",
                    models.CharField(
                        choices=[
                            ("g", "Gram"),
                            ("oz", "Ounce"),
                            ("kg", "Kilogram"),
                            ("lb", "Pound"),
                            ("each", "Each"),
                        ],
                        max_length=5,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Culture",
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
                (
                    "step",
                    models.CharField(
                        choices=[
                            ("strikewater", "Strikewater"),
                            ("mash", "Mash"),
                            ("boil", "Boil"),
                            ("fermentor", "Fermentor"),
                            ("bottle", "Bottle"),
                        ],
                        max_length=20,
                    ),
                ),
                ("timing", models.FloatField(blank=True, null=True)),
                ("notes", models.TextField(blank=True, null=True)),
                ("amount", models.FloatField()),
                (
                    "amount_type",
                    models.CharField(
                        choices=[
                            ("g", "Gram"),
                            ("oz", "Ounce"),
                            ("kg", "Kilogram"),
                            ("lb", "Pound"),
                            ("each", "Each"),
                        ],
                        max_length=5,
                    ),
                ),
                ("attenuation", models.FloatField()),
                (
                    "form",
                    models.CharField(
                        choices=[("liquid", "Liquid"), ("dry", "Dry")], max_length=10
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Fermentable",
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
                (
                    "step",
                    models.CharField(
                        choices=[
                            ("strikewater", "Strikewater"),
                            ("mash", "Mash"),
                            ("boil", "Boil"),
                            ("fermentor", "Fermentor"),
                            ("bottle", "Bottle"),
                        ],
                        max_length=20,
                    ),
                ),
                ("timing", models.FloatField(blank=True, null=True)),
                ("notes", models.TextField(blank=True, null=True)),
                ("amount", models.FloatField()),
                (
                    "amount_type",
                    models.CharField(
                        choices=[
                            ("g", "Gram"),
                            ("oz", "Ounce"),
                            ("kg", "Kilogram"),
                            ("lb", "Pound"),
                            ("each", "Each"),
                        ],
                        max_length=5,
                    ),
                ),
                ("lovibond", models.FloatField()),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("other", "Other"),
                            ("liquid_extract", "Liquid Extract"),
                            ("dry_extract", "Dry Extract"),
                            ("grain", "Grain"),
                            ("sugar", "Sugar"),
                            ("fruit", "Fruit"),
                            ("juice", "Juice"),
                            ("honey", "Honey"),
                        ],
                        max_length=20,
                    ),
                ),
                ("potential", models.FloatField()),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Hop",
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
                (
                    "step",
                    models.CharField(
                        choices=[
                            ("strikewater", "Strikewater"),
                            ("mash", "Mash"),
                            ("boil", "Boil"),
                            ("fermentor", "Fermentor"),
                            ("bottle", "Bottle"),
                        ],
                        max_length=20,
                    ),
                ),
                ("timing", models.FloatField(blank=True, null=True)),
                ("notes", models.TextField(blank=True, null=True)),
                ("amount", models.FloatField()),
                (
                    "amount_type",
                    models.CharField(
                        choices=[
                            ("g", "Gram"),
                            ("oz", "Ounce"),
                            ("kg", "Kilogram"),
                            ("lb", "Pound"),
                            ("each", "Each"),
                        ],
                        max_length=5,
                    ),
                ),
                ("alpha_acid", models.FloatField()),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="NonFermentable",
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
                (
                    "step",
                    models.CharField(
                        choices=[
                            ("strikewater", "Strikewater"),
                            ("mash", "Mash"),
                            ("boil", "Boil"),
                            ("fermentor", "Fermentor"),
                            ("bottle", "Bottle"),
                        ],
                        max_length=20,
                    ),
                ),
                ("timing", models.FloatField(blank=True, null=True)),
                ("notes", models.TextField(blank=True, null=True)),
                ("amount", models.FloatField()),
                (
                    "amount_type",
                    models.CharField(
                        choices=[
                            ("g", "Gram"),
                            ("oz", "Ounce"),
                            ("kg", "Kilogram"),
                            ("lb", "Pound"),
                            ("each", "Each"),
                        ],
                        max_length=5,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Recipe",
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
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("other", "Other"),
                            ("extract", "Extract"),
                            ("partial_mash", "Partial Mash"),
                            ("all_grain", "All Grain"),
                        ],
                        default="all_grain",
                        max_length=20,
                    ),
                ),
                ("description", models.TextField(blank=True, null=True)),
                ("author", models.CharField(blank=True, max_length=100, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("batch_size", models.FloatField(blank=True, null=True)),
                ("efficiency", models.FloatField(blank=True, null=True)),
                (
                    "measurement_type",
                    models.CharField(
                        choices=[("imperial", "Imperial"), ("metric", "Metric")],
                        default="imperial",
                        max_length=10,
                    ),
                ),
            ],
        ),
    ]
