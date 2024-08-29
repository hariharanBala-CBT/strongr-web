from django import template

register = template.Library()

@register.filter
def fix_https(url):
    return url.replace('https//', 'https://')

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@register.filter
def range_filter(value):
    return range(value)

@register.filter
def parse_date(date_string):
    return datetime.strptime(date_string, "%Y-%m-%d").date()

@register.filter
def add_days(date, days):
    return date + timedelta(days=int(days))

@register.filter
def filter_working_day(working_days, day_index):
    day_map = {
        0: 'Monday',
        1: 'Tuesday',
        2: 'Wednesday',
        3: 'Thursday',
        4: 'Friday',
        5: 'Saturday',
        6: 'Sunday'
    }
    day_name = day_map[day_index]
    return working_days.filter(days=day_name, is_active=True).exists()

@register.filter
def get_booking(bookings, key):
    return bookings.get(key, {})