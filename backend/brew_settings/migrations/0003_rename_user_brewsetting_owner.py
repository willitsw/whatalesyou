# Generated by Django 4.1.5 on 2023-02-10 01:16

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("brew_settings", "0002_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="brewsetting",
            old_name="user",
            new_name="owner",
        ),
    ]
