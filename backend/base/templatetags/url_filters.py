from django import template

register = template.Library()

@register.filter
def fix_https(url):
    return url.replace('https//', 'https://')
