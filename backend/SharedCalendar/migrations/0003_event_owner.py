# Generated by Django 4.1.3 on 2022-12-08 02:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SharedCalendar', '0002_calendarcolor'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='owner',
            field=models.TextField(default='anyone'),
            preserve_default=False,
        ),
    ]
