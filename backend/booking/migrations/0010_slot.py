# Generated by Django 3.2.20 on 2024-03-13 07:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_organizationlocationgametype_number_of_courts'),
        ('booking', '0009_auto_20240313_1123'),
    ]

    operations = [
        migrations.CreateModel(
            name='Slot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.TimeField(blank=True, null=True)),
                ('end_time', models.TimeField(blank=True, null=True)),
                ('days', models.CharField(choices=[('Sunday', 'Sunday'), ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'), ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday')], max_length=10)),
                ('is_booked', models.BooleanField(default=False)),
                ('court', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.court')),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.organizationlocation')),
            ],
        ),
    ]