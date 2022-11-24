from rest_framework import serializers
from .models import SharedCalendar

class SharedCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedCalendar
        fields = ('calendarId', 'id', 'title', 'isAllday', 'start', 'end', 'category', 'dueDateClass', 'location', 'state', 'isPrivate')