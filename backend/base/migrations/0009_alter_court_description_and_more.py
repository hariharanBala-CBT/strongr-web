# Generated by Django 5.0.3 on 2024-04-22 09:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_organizationlocation_numratings_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='court',
            name='description',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='organizationlocationamenities',
            name='description',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='organizationlocationgametype',
            name='description',
            field=models.TextField(blank=True, default=None, null=True),
        ),
    ]
