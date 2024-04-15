# Create your views here.from django.shortcuts import render
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
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.template.loader import render_to_string
from django.contrib.auth.hashers import make_password


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
def getBookingDetails(request,pk):
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

    areas = OrganizationLocation.objects.filter(area=selected_area_obj)

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


@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def createBooking(request):
    user = request.user
    data = request.data

    try:
        court_id = data['courtId']
        court = Court.objects.get(id=court_id)
        slot_id = data['slotId']
        slot = Slot.objects.get(id=slot_id)

        with transaction.atomic():
            # slot.is_booked = True
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
                booking_status = 2,

            )

        serializer = BookingDetailsSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(e, 'exception')
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

    print("Current Date and Time:", current_datetime)

    # Get all slots for the specified court and weekday
    slots = Slot.objects.filter(
        court_id=court,
        days__contains=weekday_name,
        is_booked=False
    )

    # If date_str is today's date, apply the current time filter
    if date_obj.date() == datetime.datetime.today().date():
        # Filter slots where start time is greater than or equal to the current time
        slots = slots.filter(start_time__gte=current_time)

    # Get bookings for the specified date
    bookings = Booking.objects.filter(
        court_id=court,
        booking_date=date_obj.date(),
        booking_status = 2
    ).values_list('slot', flat=True)

    # Exclude booked slots
    slots = slots.exclude(id__in=bookings)

    serializer = SlotSerializer(slots, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data

    otp_from_session = request.session.get('otp')
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


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def generateOtp(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    email = request.query_params.get('email')

    # Generate OTP
    otp = get_random_string(length=4, allowed_chars='0123456789')
    subject = 'Welcome to Our Website'
    message = render_to_string('email_otp.html', {
        'user': user,
        'otp': otp,
    })

    from_email = 'testgamefront@gmail.com'
    recipient_list = [email]
    send_mail(subject,
              message,
              from_email,
              recipient_list,
              fail_silently=False)

    request.session['otp'] = otp

    return Response(serializer.data)

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