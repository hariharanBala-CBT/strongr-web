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
        now = datetime.datetime.now()
        print(now)
        next_slot = Slot.objects.filter(
            start_time__gte=now.time(), is_booked=False,
            location=obj).order_by('start_time').first()

        next_additional_slot = AdditionalSlot.objects.filter(
            date__gte=now.date(), is_active=True,
            location=obj).order_by('date', 'start_time').first()

        if next_slot and next_additional_slot:
            if next_slot.start_time < next_additional_slot.start_time:
                return SlotSerializer(next_slot).data
            else:
                return AdditionalSlotSerializer(next_additional_slot).data
        elif next_slot:
            return SlotSerializer(next_slot).data
        elif next_additional_slot:
            return AdditionalSlotSerializer(next_additional_slot).data
        return None

    class Meta:
        model = Organization
        fields = [
            'id', 'organization', 'area', 'organization_images',
            'address_line_1', 'rating', 'next_availabilty', 'numRatings',
            'reviews'
        ]
