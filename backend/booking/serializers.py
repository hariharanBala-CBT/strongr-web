import datetime
from rest_framework import serializers
from base.models import *
from .models import *

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class GameTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameType
        fields = '__all__'

class OrganizationLocationAmenitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationLocationAmenities
        fields = '__all__'


class OrganizationLocationGameTypeSerializer(serializers.ModelSerializer):
    game_type = GameTypeSerializer()
    class Meta:
        model = OrganizationLocationGameType
        fields = '__all__'

class OrganizationGameImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationGameImages
        fields = '__all__'

class OrganizationLocationWorkingDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationLocationWorkingDays
        fields = '__all__'

class ClubSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organization
        fields = '__all__'

class ClubLocationSerializer(serializers.ModelSerializer):
    organization = ClubSerializer()
    area = AreaSerializer()
    class Meta:
        model = OrganizationLocation
        fields = '__all__'

class ClubLocSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationLocation
        fields = '__all__'

class CourtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Court
        fields = '__all__'

class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'

class AdditionalSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalSlot
        fields = '__all__'

class UnAvailableSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnavailableSlot
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class UserBookingsSerializer(serializers.ModelSerializer):
    organization_name = serializers.SerializerMethodField()
    game_type = serializers.SerializerMethodField()

    def get_organization_name(self, obj):
        return obj.court.location.organization.organization_name

    def get_game_type(self, obj):
        return obj.court.game.game_type.game_name

    class Meta:
        model = Booking
        fields = ['id', 'name', 'email', 'phone_number', 'organization_name', 'game_type', 'booking_date', 'total_price', 'booking_status', 'payment_status']


class BookingDetailsSerializer(serializers.ModelSerializer):
    court = serializers.SerializerMethodField()
    slot = serializers.SerializerMethodField()
    additional_slot = serializers.SerializerMethodField()
    organization_name = serializers.SerializerMethodField()
    organization_location = serializers.SerializerMethodField()
    game_type = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    def get_court(self, obj):
        return CourtSerializer(obj.court).data

    def get_slot(self, obj):
        return SlotSerializer(obj.slot).data

    def get_additional_slot(self, obj):
        return AdditionalSlotSerializer(obj.additional_slot).data

    def get_organization_name(self, obj):
        return obj.court.location.organization.organization_name

    def get_organization_location(self, obj):
        return obj.court.location.address_line_1

    def get_game_type(self, obj):
        return obj.court.game.game_type.game_name

    def get_image(self, obj):
        try:
            organization_location = obj.court.location
            organization_game_images = OrganizationGameImages.objects.filter(
                organization=organization_location).first()
            if organization_game_images:
                return organization_game_images.image.url
        except Exception as e:
            # Handle exceptions appropriately
            pass
        return None

    class Meta:
        model = Booking
        fields = [
            'id', 'name', 'phone_number', 'booking_date', 'booking_status',
            'payment_status', 'tax_price', 'total_price', 'organization_name',
            'court', 'slot', 'additional_slot', 'organization_location', 'game_type', 'image'
        ]
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ClubSerializerWithLocation(serializers.ModelSerializer):
    organizationlocation_set = ClubLocationSerializer(many=True, read_only=True)

    class Meta:
        model = Organization
        fields = '__all__'

from django.db.models import Q

class ClubLocationSerializerWithImages(serializers.ModelSerializer):
    organization = ClubSerializer()
    area = AreaSerializer()
    organization_images = serializers.SerializerMethodField()
    address_line_1 = serializers.SerializerMethodField()
    rating = serializers.DecimalField(max_digits=7,decimal_places=2,read_only=True)
    next_availabilty = serializers.SerializerMethodField(read_only=True)
    numRatings = serializers.IntegerField(read_only=True)
    reviews = serializers.SerializerMethodField(read_only=True)

    def get_organization_images(self, obj):
        try:
            organization_location = obj
            organization_game_images = OrganizationGameImages.objects.filter(
                organization=organization_location).first()
            if organization_game_images:
                return organization_game_images.image.url
        except Exception as e:            
            pass
        return None

    def get_address_line_1(self, obj):
        location = obj
        return location.address_line_1 if location else None

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def get_next_availabilty(self, obj):
        now = datetime.datetime.now().replace(microsecond=0)
        current_time = (now + datetime.timedelta(hours=1)).time()
        selected_date = now.date()

        # Find the first court for the given OrganizationLocation
        try:
            court = Court.objects.filter(location=obj).first()
            if not court:
                return None
        except Court.DoesNotExist:
            return None

        # Exclude unavailable and booked slots
        unavailable_slots = UnavailableSlot.objects.filter(
            court=court,
            date__gte=selected_date,
            is_active=True
        ).values_list('start_time', 'end_time')
        
        booked_slots = Booking.objects.filter(
            court=court,
            booking_date__gte=selected_date
        ).values_list('slot__start_time', 'slot__end_time')
        
        excluded_times = list(unavailable_slots) + list(booked_slots)

        nearest_slots = []

        # Find nearest slot from Slot table
        for i in range(0, 7):  # Search for up to one week
            target_date = now + datetime.timedelta(days=i)
            target_weekday = target_date.strftime('%A')

            slots = Slot.objects.filter(
                court=court,
                days=target_weekday,
                start_time__gte=(current_time if i == 0 and selected_date == now.date() else datetime.datetime.min.time())
            ).exclude(
                Q(start_time__in=[time[0] for time in excluded_times]) |
                Q(end_time__in=[time[1] for time in excluded_times])
            )

            for slot in slots:
                slot_info = {
                    'date': target_date.date(),
                    'start_time': slot.start_time,
                    'end_time': slot.end_time,
                    'source': 'slot'
                }
                nearest_slots.append(slot_info)
        
        # Find nearest slot from AdditionalSlot table
        for i in range(0, 7):  # Search for up to one week
            target_date = now + datetime.timedelta(days=i)

            additional_slots = AdditionalSlot.objects.filter(
                court=court,
                date=target_date.date(),
                is_active=True,
                start_time__gte=(current_time if i == 0 and selected_date == now.date() else datetime.datetime.min.time())
            ).exclude(
                Q(start_time__in=[time[0] for time in excluded_times]) |
                Q(end_time__in=[time[1] for time in excluded_times])
            )

            for slot in additional_slots:
                slot_info = {
                    'date': slot.date,
                    'start_time': slot.start_time,
                    'end_time': slot.end_time,
                    'source': 'additional_slot'
                }
                nearest_slots.append(slot_info)

        # Sort the collected slots by date and start_time and select the nearest one
        nearest_slots.sort(key=lambda x: (x['date'], x['start_time']))

        # If there are no available slots, return None or handle accordingly
        if not nearest_slots:
            return None
        
        # Serialize and return the nearest slot
        nearest_slot = nearest_slots[0]
        
        if nearest_slot['source'] == 'slot':
            slot = Slot.objects.get(
                court=court,
                start_time=nearest_slot['start_time'],
                end_time=nearest_slot['end_time'],
                days=nearest_slot['date'].strftime('%A')
            )
            serializer = SlotSerializer(slot)
        else:
            slot = AdditionalSlot.objects.get(
                court=court,
                start_time=nearest_slot['start_time'],
                end_time=nearest_slot['end_time'],
                date=nearest_slot['date']
            )
            serializer = AdditionalSlotSerializer(slot)
        
        return serializer.data

    class Meta:
        model = Organization
        fields = [
            'id', 'organization', 'area', 'organization_images',
            'address_line_1', 'rating', 'next_availabilty', 'numRatings',
            'reviews'
        ]
