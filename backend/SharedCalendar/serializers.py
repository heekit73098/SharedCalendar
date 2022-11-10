from rest_framework import serializers
from .models import SharedCalendar

class SharedCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedCalendar
        fields = ('id', 'title', 'description', 'datetime')