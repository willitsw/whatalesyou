# Generated by Django 4.1.5 on 2023-10-28 23:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="is_verified",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="user",
            name="verification_code",
            field=models.TextField(blank=True, max_length=5, null=True),
        ),
    ]
