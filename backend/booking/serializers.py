import datetime
from rest_framework import serializers
from base.models import *
from .models import *
from .utils import get_nearest_available_slot

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
    rating = serializers.SerializerMethodField()
    num_ratings = serializers.SerializerMethodField()

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
    
    def get_rating(self, obj):
        return obj.court.location.rating
    
    def get_num_ratings(self, obj):
        return obj.court.location.numRatings

    class Meta:
        model = Booking
        fields = [
            'id', 'name', 'phone_number', 'booking_date', 'booking_status',
            'payment_status', 'tax_price', 'total_price', 'organization_name',
            'court', 'slot', 'additional_slot', 'organization_location', 'game_type', 'image','rating','num_ratings'
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
        print(now)
        selected_date = now.date()

        try:
            court = Court.objects.filter(location=obj).first()
            if not court:
                return None
        except Court.DoesNotExist:
            return None

        nearest_slot = get_nearest_available_slot(court, now, selected_date)

        if not nearest_slot:
            return None

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