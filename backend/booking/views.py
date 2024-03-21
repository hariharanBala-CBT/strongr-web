# Create your views here.from django.shortcuts import render
from .organizations import organizations
from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.models import *
from booking.serializers import *
from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Booking
from .serializers import BookingSerializer 
import datetime

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
    game = OrganizationLocationGameType.objects.filter(organization_location_id=pk)
    serializer = OrganizationLocationGameTypeSerializer(game, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getClubAmenities(request, pk):
    amenities = OrganizationLocationAmenities.objects.get(organization_location_id=pk)
    serializer = OrganizationLocationAmenitiesSerializer(amenities, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getClubWorkingDays(request, pk):
    days = OrganizationLocationWorkingDays.objects.filter(organization_location_id=pk)
    serializer = OrganizationLocationWorkingDaysSerializer(days, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getClubImages(request, pk):
    images = OrganizationGameImages.objects.filter(organization_id=pk)
    serializer = OrganizationGameImagesSerializer(images, many=True)
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

    serializer = ClubLocationSerializer(organizationlocations, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createBooking(request):
    print("entered view")
    user = request.user
    data = request.data
    
    try:
        print("entered try")
        court_id = data['court']['id']
        court = Court.objects.get(id=court_id)
        booking_date_str = data.get('date', '')

        try:
            booking_date = datetime.datetime.strptime(booking_date_str, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError('Invalid date format. It must be in YYYY-MM-DD format.')

        duration_value = data.get('duration', '')
        duration = datetime.timedelta(hours=int(duration_value))
        
        slot_id = data.get('slot', None)
        slot = None

        if slot_id:
            try:
                slot = Slot.objects.get(id=slot_id)
            except Slot.DoesNotExist:
                return Response({'detail': 'Invalid slot ID'}, status=status.HTTP_400_BAD_REQUEST)

        booking = Booking.objects.create(
            user=user,
            name=user.first_name,
            email=data['userInfo']['email'],
            phone_number='8467586845',
            booking_date=booking_date,
            duration=duration,
            court=court,
            slot=slot,
        )

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(e, 'exception')
        return Response({'detail': 'Booking not created'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def getAvailableSlots(request, pk):
    print('entered')
    data = request.data
    # date_str = data['date']
    # print('dATE', date_str)

    # if not date_str:
    #     return Response({'detail': 'Date parameter is missing.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        dates = request.query_params.get('date')
        print(dates,'this')
        date = datetime.strptime(dates, '%Y-%m-%d').date()
        print(date)
    except ValueError:
        return Response({'detail': 'Invalid date format. It must be in YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)
    print(f"Location ID: {pk}, Date: {dates}, Working Days: {working_days}")

    working_days = OrganizationLocationWorkingDays.objects.filter(
        organization_location__pk=pk,
        days=date.strftime('%A')
    )

    slots = []
    for working_day in working_days:
        start_time = datetime.combine(date, working_day.work_from_time)
        end_time = datetime.combine(date, working_day.work_to_time)
        current_time = start_time

        while current_time < end_time:
            slots.append({
                'start_time': current_time.time(),
                'end_time': (current_time + datetime.timedelta(hours=1)).time(),
            })
            current_time += datetime.timedelta(hours=1)
    serializer = SlotSerializer(slots, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def getCourts(request, pk):
    game = request.query_params.get('game')
    print(game)

    courts = Court.objects.filter(location_id=pk, game__game_type__game_name=game)
    serializer = CourtSerializer(courts, many=True)
    return Response(serializer.data)
