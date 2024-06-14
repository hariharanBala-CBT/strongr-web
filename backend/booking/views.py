from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.models import *
from base.serializers import *
from .models import Booking
from .serializers import *
from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from dateutil.parser import parse
import datetime
from datetime import timedelta
from django.db import transaction
from django.contrib.auth.hashers import make_password


@api_view(['GET'])
def ValidateUser(request):
    username = request.GET.get('username')

    try:
        if not username:
            return Response({'detail': 'Username is required'},status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(username=username).first()
        if not user:
            return Response({'detail': 'User does not exist'},status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'User exists'}, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({'detail': 'User cannot be validated'},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def ValidatePhone(request):
    phone = request.GET.get('phone')
    phone = phone[2:]

    try:
        if not phone:
            return Response({'detail': 'phone is required'},status=status.HTTP_400_BAD_REQUEST)
        customer = Customer.objects.get(phone_number = phone)
        if not customer:
            return Response({'detail': 'User does not exist'},status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'User exists'}, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({'detail': 'phone number cannot be validated'},status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def search(request):
    query = request.GET.get('keyword')
    organizations = Organization.objects.all()

    if query:
        organizations = organizations.filter(
            organization_name__icontains=query)

    organization_locations = OrganizationLocation.objects.filter(
        organization__in=organizations, status=1, organization__status=1)

    serializer = ClubSerializerWithImages(organization_locations, many=True)
    serialized_data = serializer.data
    return Response(serialized_data)


@api_view(['GET'])
def recentSearch(request):
    stored_keywords = request.GET.getlist('storedKeywords[]')

    organization_locations = OrganizationLocation.objects.filter(
        id__in=stored_keywords)

    serializer = ClubSerializerWithImages(organization_locations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getAreas(request):
    areas = Area.objects.all()
    serializer = AreaSerializer(areas, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getGameTypes(request):
    games = GameType.objects.all()
    serializer = GameTypeSerializer(games, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getClubs(request):
    clubs = Organization.objects.all()
    serializer = ClubSerializer(clubs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getClub(request, pk):
    club = Organization.objects.get(id=pk)
    serializer = ClubSerializer(club, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getClubLocation(request, pk):
    club = OrganizationLocation.objects.get(id=pk)
    serializer = ClubLocationSerializer(club, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getClubGame(request, pk):
    game = OrganizationLocationGameType.objects.filter(
        organization_location_id=pk)
    serializer = OrganizationLocationGameTypeSerializer(game, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getClubAmenities(request, pk):
    amenities = OrganizationLocationAmenities.objects.get(
        organization_location_id=pk)
    serializer = OrganizationLocationAmenitiesSerializer(amenities, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getClubWorkingDays(request, pk):
    days = OrganizationLocationWorkingDays.objects.filter(
        organization_location_id=pk)
    serializer = OrganizationLocationWorkingDaysSerializer(days, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getClubImages(request, pk):
    images = OrganizationGameImages.objects.filter(organization_id=pk)
    serializer = OrganizationGameImagesSerializer(images, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getBookingDetails(request, pk):
    booking = Booking.objects.get(id=pk)
    serializer = BookingDetailsSerializer(booking)
    return Response(serializer.data)


@api_view(['GET'])
def getCourt(request, pk):
    court = Court.objects.get(id=pk)
    serializer = CourtSerializer(court, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getSlot(request, pk):
    slot = Slot.objects.get(id=pk)
    serializer = SlotSerializer(slot, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getUserBookings(request, pk):
    booking = Booking.objects.filter(user=pk)
    serializer = UserBookingsSerializer(booking, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getCustomer(request, pk):
    customer = Customer.objects.get(user=pk)
    serializer = CustomerSerializer(customer, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def filterClubs(request):
    selected_area = request.query_params.get('area')
    selected_game = request.query_params.get('game')
    date = request.query_params.get('date')

    try:
        selected_area_obj = Area.objects.get(area_name=selected_area)
    except Area.DoesNotExist:
        return Response({'error': f'Area {selected_area} not found'},
                        status=status.HTTP_404_NOT_FOUND)

    time = datetime.datetime.strptime(date, '%Y-%m-%d')
    day = time.strftime('%A')

    areas = OrganizationLocation.objects.filter(area=selected_area_obj,
                                                status=1,
                                                organization__status=1)

    game_names = []
    for location in areas:
        if len(
                OrganizationLocationWorkingDays.objects.filter(
                    days=day, organization_location=location,
                    is_active=True)) == 1:
            game_names += OrganizationLocationGameType.objects.filter(
                game_type__game_name=selected_game,
                organization_location=location).select_related(
                    'organization_location__organization')

    organizationlocations = [
        org_game_name.organization_location for org_game_name in game_names
    ]

    serializer = ClubSerializerWithImages(organizationlocations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getSuggestedClub(request):
    selected_area = request.query_params.get('area')
    print(selected_area)

    try:
        selected_area_obj = Area.objects.get(area_name=selected_area)
        organizationlocations = OrganizationLocation.objects.filter(
            area=selected_area_obj, status=1, organization__status=1)
        serializer = ClubSerializerWithImages(organizationlocations, many=True)
        return Response(serializer.data)

    except Area.DoesNotExist:
        return Response({'error': f'Area {selected_area} not found'},
                        status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getSuggestedClubGame(request):
    selected_game = request.query_params.get('game')

    try:
        selected_game_obj = GameType.objects.get(game_name=selected_game)
        organization_location_game_types = OrganizationLocationGameType.objects.filter(
            game_type=selected_game_obj, is_active=True)

        organization_locations = [
            ogt.organization_location
            for ogt in organization_location_game_types
            if ogt.organization_location.status == 1
        ]

        serializer = ClubSerializerWithImages(organization_locations,
                                              many=True)
        return Response(serializer.data)

    except GameType.DoesNotExist:
        return Response({'error': f'Game {selected_game} not found'},
                        status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def createBooking(request):
    user = request.user
    data = request.data

    if 'slotId' in data:
        try:
            court_id = data['courtId']
            court = Court.objects.get(id=court_id)
            slot_id = data['slotId']
            slot = Slot.objects.get(id=slot_id)

            with transaction.atomic():
                slot.save()

                booking = Booking.objects.create(
                    user=user,
                    name=user.first_name,
                    email=data['userInfo']['email'],
                    phone_number=data['phoneNumber'],
                    booking_date=data['date'],
                    court=court,
                    slot=slot,
                    tax_price=data['taxPrice'],
                    total_price=data['totalPrice'],
                    booking_status=2,
                )

            serializer = BookingDetailsSerializer(booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)
            return Response({'detail': 'Booking not created'},
                            status=status.HTTP_400_BAD_REQUEST)

    elif 'addSlotId' in data:
        try:
            court_id = data['courtId']
            court = Court.objects.get(id=court_id)
            add_slot = data['addSlotId']
            slot = AdditionalSlot.objects.get(id=add_slot)

            with transaction.atomic():
                slot.save()

                booking = Booking.objects.create(
                    user=user,
                    name=user.first_name,
                    email=data['userInfo']['email'],
                    phone_number=data['phoneNumber'],
                    booking_date=data['date'],
                    court=court,
                    additional_slot=slot,
                    tax_price=data['taxPrice'],
                    total_price=data['totalPrice'],
                    booking_status=2,
                )

            serializer = BookingDetailsSerializer(booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)
            return Response({'detail': 'Booking not created'},
                            status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getCourts(request, pk):
    game = request.query_params.get('game')

    courts = Court.objects.filter(location_id=pk,
                                  game__game_type__game_name=game)
    serializer = CourtSerializer(courts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getAvailableSlots(request):
    court = request.query_params.get('courtId')
    date_str = request.query_params.get('date')

    date_obj = parse(date_str)
    weekday_name = date_obj.strftime('%A')

    current_datetime = datetime.datetime.now().replace(microsecond=0)
    current_time = (current_datetime + timedelta(hours=1)).time()

    slots = Slot.objects.all()

    slots = Slot.objects.filter(court_id=court,
                                days=weekday_name,
                                is_booked=False)

    if date_obj.date() == datetime.datetime.today().date():
        slots = slots.filter(start_time__gte=current_time)

    bookings = Booking.objects.filter(court_id=court,
                                      booking_date=date_obj.date(),
                                      booking_status=2).values_list('slot',
                                                                    flat=True)

    # Exclude booked slots
    slots = slots.exclude(id__in=bookings)
    serializer = SlotSerializer(slots, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getAdditionalSlots(request):
    court = request.query_params.get('courtId')
    date_str = request.query_params.get('date')

    slots = AdditionalSlot.objects.filter(court=court,
                                          date=date_str,
                                          is_active=True)
    serializer = AdditionalSlotSerializer(slots, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getUnavailableSlots(request):
    court = request.query_params.get('courtId')
    date_str = request.query_params.get('date')

    slots = UnavailableSlot.objects.filter(court=court,
                                           date=date_str,
                                           is_active=True)
    serializer = UnAvailableSlotSerializer(slots, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    try:
        user = request.user
        serializer = UserSerializerWithToken(user, many=False)

        data = request.data

        otp_from_session = request.session.get('emailedotp')
        if not otp_from_session or otp_from_session != data.get('otp'):
            return Response({'error': 'Invalid OTP'},
                            status=status.HTTP_400_BAD_REQUEST)

        user.first_name = data['fname']
        user.username = data['email']
        user.email = data['email']

        customer = Customer.objects.get(user=user.id)
        customer.phone_number = data['phone']
        customer.save()
        user.save()

        return Response(serializer.data)

    except Exception as e:
        print(e)
        return Response({'detail': 'User profile not updated'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def cancelBooking(request, pk):
    booking = Booking.objects.get(id=pk)
    booking.booking_status = 3
    booking.save()
    serializer = BookingDetailsSerializer(booking, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
def resetPassword(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)


@api_view(['GET'])
def getClubReviews(request, pk):
    reviews = Review.objects.filter(organization_location=pk)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user

    try:
        organization_location = OrganizationLocation.objects.get(pk=pk)
    except OrganizationLocation.DoesNotExist:
        content = {'detail': 'OrganizationLocation not found'}
        return Response(content, status=status.HTTP_404_NOT_FOUND)

    data = request.data

    # Check if rating is provided and not 0
    rating = data.get('rating')
    if rating is None or rating == 0:
        content = {'detail': 'Please provide a valid rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # Fetch or create Customer instance
    try:
        customer = Customer.objects.get(user=user)
    except Customer.DoesNotExist:
        try:
            customer = Customer.objects.create(
                tenant=user.tenant,
                user=user,
                phone_number=None  # You can update this as needed
            )
        except IntegrityError:
            # Handle the IntegrityError, e.g., if there's a unique constraint violation
            return Response({'detail': 'Error creating Customer'},
                            status=status.HTTP_400_BAD_REQUEST)

    # Create review
    review = Review.objects.create(
        customer=customer,
        organization_location=organization_location,
        name=user.first_name,
        rating=rating,
        comment=data.get('comment', ''),  # Use get to provide a default value
    )

    # Update organization_location's rating and numRatings
    reviews = organization_location.review_set.all()
    organization_location.numRatings = len(reviews)

    total = sum(review.rating for review in reviews)
    organization_location.rating = total / len(reviews)

    organization_location.save()
    serializer = ReviewSerializer(review, many=False)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])  # Change to POST method
def PhoneLoginView(request):
    data = request.data
    phone = data['phone_number']

    try:
        customer = Customer.objects.get(phone_number=phone[2:12])
        user = User.objects.get(id=customer.user_id)

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Customer.DoesNotExist:
        return Response(
            {'No active user credentials found. Please sign up to login.'},
            status=status.HTTP_404_NOT_FOUND)

    except KeyError:
        message = {'phone_number is required'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
