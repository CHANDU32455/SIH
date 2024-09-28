# Generated by Django 5.1.1 on 2024-09-28 13:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory_management', '0004_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stations',
            fields=[
                ('station_id', models.CharField(max_length=50, primary_key=True, serialize=False, unique=True)),
                ('station_name', models.CharField(max_length=50)),
                ('station_location', models.CharField(max_length=150)),
            ],
        ),
    ]