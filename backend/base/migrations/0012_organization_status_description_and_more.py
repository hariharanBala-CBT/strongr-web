# Generated by Django 5.0.4 on 2024-05-06 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0011_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='status_description',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='organizationlocation',
            name='status_description',
            field=models.TextField(blank=True, default=None, null=True),
        ),
    ]
