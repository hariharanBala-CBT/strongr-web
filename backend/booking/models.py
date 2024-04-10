from datetime import timezone
from django.db import models
from base.models import *
from django.contrib.auth.models import User

class Slot(models.Model):
    day_choices = (
        ('Sunday', 'Sunday'),
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
    )

    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    court = models.ForeignKey(Court, on_delete=models.CASCADE)
    location = models.ForeignKey(OrganizationLocation,
                                 on_delete=models.CASCADE)
    # date = models.DateField(auto_now=True)
    days = models.CharField(max_length=10, choices=day_choices,null=True)
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.start_time.strftime('%H:%M')} to {self.end_time.strftime('%H:%M')}"


class Booking(models.Model):

    YET_TO_BEGIN = 1
    INITIATED = 2
    IN_PROGRESS = 3
    SUCCESS = 4
    FAILED = 5
    payment_status_choices = (
        (YET_TO_BEGIN, 'Yet to Begin'),
        (INITIATED, 'Initiated'),
        (IN_PROGRESS, 'In Progress'),
        (SUCCESS, 'Success'),
        (FAILED, 'Cancelled'),
    )

    PENDING = 1
    CONFIRMED = 2
    CANCELLED = 3
    booking_status_choices = (
        (PENDING, 'Pending'),
        (CONFIRMED, 'Confirmed'),
        (CANCELLED, 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=50)
    phone_number = models.CharField(max_length=20)
    organization_booking = models.BooleanField(default=False)
    booking_date = models.DateField(null=True, blank=True)
    payment_status = models.IntegerField(choices=payment_status_choices,
                                         default=YET_TO_BEGIN)
    court = models.ForeignKey(Court, on_delete=models.CASCADE)
    slot = models.ForeignKey(Slot,
                             on_delete=models.CASCADE,
                             null=True,
                             blank=True)
    created_at = models.DateTimeField(auto_now=True)
    tax_price = models.PositiveBigIntegerField(null=True, blank=True)
    total_price = models.PositiveBigIntegerField(null=True, blank=True)

    booking_status =models.IntegerField(choices=booking_status_choices,default=PENDING)

    def __str__(self):
        return f"{self.name}"
