from django.contrib import admin
from .models import SharedCalendar
# Register your models here.


class SharedCalendarAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'datetime')

# Register your models here.

admin.site.register(SharedCalendar, SharedCalendarAdmin)