# Generated by Django 5.0.7 on 2024-08-13 14:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bounty_list_app', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bounty_filter',
            old_name='max_price',
            new_name='price_max',
        ),
        migrations.RenameField(
            model_name='bounty_filter',
            old_name='year',
            new_name='year_min',
        ),
    ]
