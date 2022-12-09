from django.contrib import admin
from .models import Event, Calendar, CalendarColor
# Register your models here.


class EventAdmin(admin.ModelAdmin):
    list_display = ('calendarId', 'id', 'title', 'isAllday', 'start', 'end', 'category', 'dueDateClass', 'location', 'state', 'isPrivate', 'tag', 'owner')

class CalendarAdmin(admin.ModelAdmin):
    list_display = ('calendarID', 'name')

class CalendarColorAdmin(admin.ModelAdmin):
    list_display = ('calendarID', 'user', 'color')

# Register your models here.

admin.site.register(Event, EventAdmin)
admin.site.register(Calendar, CalendarAdmin)
admin.site.register(CalendarColor, CalendarColorAdmin)