from rest_framework import viewsets, status, permissions
from .serializers import EventSerializer, UserSerializer, LoginSerializer, CalendarColorSerializer
from .models import Calendar, Event, CalendarColor
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import login, logout, get_user
from django.http import JsonResponse
from django.utils.crypto import get_random_string
from django.db.utils import IntegrityError
import string
# Create your views here.


class EventView(APIView):
    
    def get(self, request):
        user = get_user(request)
        serializer_class = EventSerializer
        calendars = user.calendar_set.values_list('calendarID')
        queryset = Event.objects.filter(calendarId__in=calendars)
        data = serializer_class(queryset, many=True).data
        return Response(data, status=status.HTTP_200_OK)
        

    def post(self, request):
        name = get_user(request).get_short_name()
        while not request.data["id"]:
            newID = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
            if not Event.objects.filter(pk=newID).exists():
                request.data["id"] = newID
                request.data["tag"] = newID
        Event.objects.create(
            calendarId = request.data["calendarId"],
            id = request.data["id"],
            title = request.data["title"],
            isAllday = request.data["isAllday"],
            start = request.data["start"],
            end = request.data["end"],
            category = request.data["category"],
            dueDateClass = request.data["dueDateClass"],
            location = request.data["location"],
            state = request.data["state"],
            isPrivate = request.data["isPrivate"],
            tag = request.data["tag"],
            owner = name
        )
        return Response(None, status=status.HTTP_201_CREATED)
    
    def delete(self, request):
        tag = request.GET.get("tag", "")
        Event.objects.filter(tag = tag).delete()
        return Response(None, status=status.HTTP_200_OK)
    
    def patch(self, request):
        tag = request.GET.get("tag", "")
        events = Event.objects.filter(tag = tag)
        for event in events:
            serializer = EventSerializer(event, data=request.data, partial=True) 
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(None, status=status.HTTP_400_BAD_REQUEST)
        return Response(None, status=status.HTTP_200_OK)
        


class EventsView(APIView):
    def post(self, request):
        name = get_user(request).get_short_name()
        while True:
            newTag = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
            if not Event.objects.filter(tag = newTag).exists():
                break
        for event in request.data:
            while True:
                newID = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
                if not Event.objects.filter(pk=newID).exists():
                    break
            Event.objects.create(
                calendarId = event["calendarId"],
                id = newID,
                title = event["title"],
                isAllday = event["isAllday"],
                start = event["start"],
                end = event["end"],
                category = event["category"],
                dueDateClass = event["dueDateClass"],
                location = event["location"],
                state = event["state"],
                isPrivate = event["isPrivate"],
                tag = newTag,
                owner = name
            )
        return Response(None, status=status.HTTP_201_CREATED)

class UserCreate(APIView):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ['post']
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                createdCalendar = Calendar(
                    calendarID = "",
                    name = "Personal"
                )
                createdCalendar.save()
                createdCalendar.users.add(user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data,
            context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response(None, status=status.HTTP_202_ACCEPTED)

class LogoutView(APIView):
    def post(self, request, format=None):
        logout(request)
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class ProfileView(APIView):
    def get(self, request):
        user = get_user(request)
        return JsonResponse({
            'email': user.get_username(),
            'full_name': user.get_full_name()
        }, status=status.HTTP_200_OK)

class AddCalendarView(APIView):
    def get(self, request):
        user = get_user(request)
        # calendars = CalendarSerializer(Calendar.objects.filter(users = user))
        calendars = Calendar.objects.filter(users = user).values_list()
        return Response(calendars, status=status.HTTP_200_OK)
    def post(self, request):
        user = get_user(request)
        if request.data["choice"] == "join":
            if Calendar.objects.filter(calendarID = request.data["field"]).exists():
                Calendar.objects.get(pk=request.data["field"]).users.add(user)
                return Response(None, status=status.HTTP_201_CREATED)
            else:
                return Response({"Error": "Invalid ID"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            createdCalendar = Calendar(
                calendarID = "",
                name = request.data["field"]
            )
            createdCalendar.save()
            createdID = createdCalendar.calendarID
            createdCalendar.users.add(user)
            return Response({'calendarID': createdID}, status=status.HTTP_201_CREATED)

class CalendarColorView(APIView):
    def get(self, request):
        username = get_user(request).get_username()
        queryset = CalendarColor.objects.filter(user = username)
        data = CalendarColorSerializer(queryset, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        print(request.data)
        username = get_user(request).get_username()
        for calendar in request.data:
            try:
                CalendarColor.objects.update_or_create(
                    calendarID = calendar,
                    user = username,
                    defaults= {
                        "calendarID": calendar,
                        "user" : username,
                        "color" : request.data[calendar]
                    }
                )
            except IntegrityError:
                print("No Change to Color")
                continue
        return Response(None, status=status.HTTP_200_OK)
        

class SessionView(APIView):
    @staticmethod
    def get(request, format=None):
        return JsonResponse({'isAuthenticated': True})


