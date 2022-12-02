from rest_framework import viewsets
from .serializers import EventSerializer, UserSerializer
from .models import Event
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class EventView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    

class UserCreate(viewsets.ModelViewSet):
    """ 
    Creates the user. 
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    # def post(self, request, format='json'):
    #     serializer = UserSerializer(data=request.data)
    #     if serializer.is_valid():
    #         user = serializer.save()
    #         if user:
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)

    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
