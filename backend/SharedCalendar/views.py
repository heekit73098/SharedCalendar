from django.shortcuts import render
from rest_framework import viewsets
from .serializers import SharedCalendarSerializer
from .models import SharedCalendar

# Create your views here.

class SharedCalendarView(viewsets.ModelViewSet):
    serializer_class = SharedCalendarSerializer
    queryset = SharedCalendar.objects.all()
