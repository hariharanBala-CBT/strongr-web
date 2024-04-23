from django.db import models
from django.contrib.auth.models import User
import os

class Tenant(models.Model):
    tenant_name = models.CharField(max_length=100)
    sign_up_terms_and_conditions = models.TextField()
    booking_terms_and_conditions = models.TextField()

    def __str__(self):
        return self.tenant_name

class TenantUser(models.Model):
    tenant = models.ForeignKey(Tenant,on_delete=models.PROTECT)
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.user)

class Customer(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.PROTECT)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.PositiveBigIntegerField(default=None)
    is_active = models.BooleanField(default=True)

class Country(models.Model):
    tenant = models.ForeignKey(Tenant,on_delete=models.PROTECT)
    country_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.country_name

class State(models.Model):
    country = models.ForeignKey(Country,on_delete=models.CASCADE)
    state_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.state_name

class City(models.Model):
    state = models.ForeignKey(State,on_delete=models.CASCADE)
    city_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.city_name

class Area(models.Model):
    city = models.ForeignKey(City,on_delete=models.CASCADE)
    area_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.area_name

class GameType(models.Model):
    game_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default = True)

    def __str__(self):
        return self.game_name

class Organization(models.Model):

    APPROVED = 1
    PENDING = 2
    IN_PROGRESS = 3
    CANCELLED = 4
    status_choices =(
     (APPROVED, 'Approved'),
     (PENDING, 'Pending'),
     (IN_PROGRESS, 'In Progress'),
     (CANCELLED, 'Cancelled'),
    )

    user = models.OneToOneField(User,on_delete=models.CASCADE)
    tenant = models.ForeignKey(Tenant, on_delete=models.PROTECT)
    organization_name = models.CharField(max_length=100,default=None,blank=True,null=True)
    phone_number = models.PositiveBigIntegerField(default=None,blank=True,null=True)
    alt_number = models.PositiveBigIntegerField(default=None,blank=True,null=True)
    description = models.TextField(default=None,blank=True,null=True)
    is_terms_and_conditions_agreed = models.BooleanField(default = False)
    status = models.IntegerField(choices = status_choices, default = PENDING)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.organization_name


class OrganizationLocation(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    address_line_1 = models.TextField()
    address_line_2 = models.TextField()
    area = models.ForeignKey(Area, on_delete=models.PROTECT)
    pincode = models.IntegerField()
    phone_number = models.PositiveBigIntegerField()
    rating = models.DecimalField(max_digits=7,
                                 decimal_places=2,
                                 null=True,
                                 blank=True)
    numRatings = models.IntegerField(null=True, blank=True, default=0)
    join_date = models.DateField(null=True, blank=True)
    created_date_time = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.address_line_1

class Review(models.Model):
    organization_location = models.ForeignKey(OrganizationLocation, on_delete=models.SET_NULL, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.rating)


class OrganizationLocationAmenities(models.Model):
    organization_location = models.ForeignKey(OrganizationLocation,on_delete=models.CASCADE)
    is_parking = models.BooleanField(default=False)
    is_restrooms = models.BooleanField(default=False)
    is_changerooms = models.BooleanField(default=False)
    is_powerbackup = models.BooleanField(default=False)
    is_beverages_facility = models.BooleanField(default=False)
    is_coaching_facilities = models.BooleanField(default=False)
    description = models.TextField(default=None,blank=True,null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.organization_location)


class OrganizationLocationGameType(models.Model):

    one = 1
    two = 2
    three = 3
    four = 4
    five = 5
    six = 6
    seven = 7
    eight = 8
    nine = 9
    ten = 10
    court_number_choices =(
     (one, 'one'),
     (two, 'two'),
     (three, 'three'),
     (four, 'four'),
     (five, 'five'),
     (six, 'six'),
     (seven, 'seven'),
     (eight, 'eight'),
     (nine, 'nine'),
     (ten, 'ten'),
    )


    organization_location = models.ForeignKey(OrganizationLocation,
                                              on_delete=models.CASCADE)
    game_type = models.ForeignKey(GameType, on_delete=models.PROTECT)
    pricing = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(default=None,blank=True,null=True)
    is_active = models.BooleanField(default=True)
    number_of_courts = models.IntegerField(choices = court_number_choices, default = one)

    def __str__(self):
        return f"{self.game_type}"


class OrganizationLocationWorkingDays(models.Model):
    day_choices=(
        ('Sunday','Sunday'),
        ('Monday','Monday'),
        ('Tuesday','Tuesday'),
        ('Wednesday','Wednesday'),
        ('Thursday','Thursday'),
        ('Friday','Friday'),
        ('Saturday','Saturday'),
    )

    organization_location = models.ForeignKey(OrganizationLocation, on_delete=models.CASCADE)
    days = models.CharField(max_length=10,choices=day_choices)
    work_from_time = models.TimeField(null=True,blank=True)
    work_to_time = models.TimeField(null=True,blank=True)
    is_active = models.BooleanField(default = True)

    def __str__(self):
        return str(self.organization_location)

def get_organization_image_upload_path(instance, filename):
    organization_name = instance.organization.organization.organization_name.replace(' ', '_')
    location_address_line_2 = instance.organization.address_line_2.replace(' ', '_')
    return os.path.join('organization', organization_name, location_address_line_2, filename)

class OrganizationGameImages(models.Model):
    organization = models.ForeignKey(OrganizationLocation, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_organization_image_upload_path, null=True, blank=True)
    is_active = models.BooleanField(default = True)

class Court(models.Model):
    name = models.CharField(max_length=100)
    location = models.ForeignKey(OrganizationLocation, on_delete=models.CASCADE)
    game = models.ForeignKey(OrganizationLocationGameType, on_delete=models.CASCADE)
    description = models.TextField(default=None,blank=True,null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.game}"
