# Generated by Django 5.1.1 on 2024-10-15 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory_management', '0024_assetrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='assetrequest',
            name='requesting_station',
            field=models.TextField(blank=True, null=True),
        ),
    ]