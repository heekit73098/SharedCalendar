from django.contrib import admin
from .models import SharedCalendar
# Register your models here.


class SharedCalendarAdmin(admin.ModelAdmin):
    list_display = ('calendarId', 'id', 'title', 'isAllday', 'start', 'end', 'category', 'dueDateClass', 'location', 'state', 'isPrivate')

# Register your models here.

admin.site.register(SharedCalendar, SharedCalendarAdmin)