# Generated by Django 5.0.7 on 2024-08-07 16:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('garage_app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='garage',
            name='cars',
        ),
        migrations.AddField(
            model_name='garagedcar',
            name='garage',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='cars', to='garage_app.garage'),
            preserve_default=False,
        ),
    ]
