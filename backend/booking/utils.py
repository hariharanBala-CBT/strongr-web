from datetime import datetime, timedelta, time
from django.db.models import Q
from .models import UnavailableSlot, Booking, Slot, AdditionalSlot

def get_nearest_available_slot(court, current_datetime, selected_date):
    unavailable_slots = UnavailableSlot.objects.filter(
        court=court,
        date__gte=selected_date,
        is_active=True
    ).values_list('start_time', 'end_time')

    booked_slots = Booking.objects.filter(
        court=court,
        booking_date__gte=selected_date
    ).filter(
        Q(slot__isnull=False) | Q(additional_slot__isnull=False)
    ).values_list(
        'slot__start_time', 'slot__end_time',
        'additional_slot__start_time', 'additional_slot__end_time'
    )

    excluded_times = list(unavailable_slots) + list(booked_slots)

    nearest_slots = []

    # Find nearest slot from Slot table
    for i in range(0, 7):  # Search for up to one week
        target_date = selected_date + timedelta(days=i)
        target_weekday = target_date.strftime('%A')

        slots = Slot.objects.filter(
            court=court,
            days=target_weekday,
            is_booked=False,
            start_time__gte=(current_datetime.time() if i == 0 and selected_date == current_datetime.date() else time.min)
        ).exclude(
            Q(start_time__in=[time[0] for time in excluded_times]) |
            Q(end_time__in=[time[1] for time in excluded_times])
        )

        for slot in slots:
            slot_info = {
                'date': target_date,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'source': 'slot'
            }
            nearest_slots.append(slot_info)

    # Find nearest slot from AdditionalSlot table
    for i in range(0, 7):  # Search for up to one week
        target_date = selected_date + timedelta(days=i)

        additional_slots = AdditionalSlot.objects.filter(
            court=court,
            date=target_date,
            is_active=True,
            start_time__gte=(current_datetime.time() if i == 0 and selected_date == current_datetime.date() else time.min)
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

    return nearest_slots[0] if nearest_slots else None
