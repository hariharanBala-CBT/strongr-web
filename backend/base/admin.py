from django.contrib import admin
from .models import *
from booking.models import *
admin.site.register(Tenant)
admin.site.register(TenantUser)
admin.site.register(Customer)
admin.site.register(Country)
admin.site.register(State)
admin.site.register(City)
admin.site.register(Area)
admin.site.register(Message)
admin.site.register(GameType)
admin.site.register(Organization)
admin.site.register(Coupon)
admin.site.register(OrganizationLocation)
admin.site.register(Review)
admin.site.register(OrganizationLocationGameType)
admin.site.register(OrganizationLocationAmenities)
admin.site.register(OrganizationLocationWorkingDays)
admin.site.register(OrganizationGameImages)
admin.site.register(Court)
admin.site.register(Booking)
admin.site.register(Slot)
admin.site.register(AdditionalSlot)
admin.site.register(UnavailableSlot)
