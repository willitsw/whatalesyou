# Generated by Django 4.1.5 on 2023-02-09 21:20

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("brew_settings", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="brewsetting",
            name="user",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="settings",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]