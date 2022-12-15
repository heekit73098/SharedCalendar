from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import viewsets, status, permissions
from .serializers import EventSerializer, UserSerializer, LoginSerializer, CalendarColorSerializer
from .models import Calendar, Event, CalendarColor
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import login, logout, get_user
from django.http import JsonResponse, HttpResponse
from django.utils.crypto import get_random_string
from django.db.utils import IntegrityError
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
import string
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import threading

class EmailThread(threading.Thread):
    def __init__(self, mail_subject, message, to_email):
        self.mail_subject = mail_subject
        self.message = message
        self.to_email = to_email
        threading.Thread.__init__(self)

    def run (self):
        email = EmailMessage(
            self.mail_subject, self.message, to=[self.to_email]
        )
        email.send()

def sendEmail(mail_subject, message, to_email):
    EmailThread(mail_subject, message, to_email).start()
# Create your views here.

tokenGenerator = PasswordResetTokenGenerator()  
defaultColor = "#0000FF"

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
            user.is_active = False
            user.save()
            if user:
                current_site = get_current_site(request)
                mail_subject = 'Activation link for Futurum'
                message = render_to_string('account_activation.html', {
                    'user': user.get_short_name(), 
                    'domain': current_site.domain,
                    'uid': urlsafe_base64_encode(user.get_username().encode()),
                    'token': tokenGenerator.make_token(user),
                })
                to_email = user.email   
        else:
            if User.objects.filter(username=request.data['username']).exists():
                user = User.objects.get(username=request.data['username'])
                mail_subject = 'Duplicate Registration on Futurum'
                message = f"Hi {user.get_short_name()},\nSomeone tried to register an account on Futurum with your email address. If this was not done by you, rest assured that your account is safe with us."
                to_email = user.email
        sendEmail(mail_subject, message, to_email)
        return Response({"message":'A confirmation email has been sent to your email address.'}, status=status.HTTP_201_CREATED)

class ActivateView(APIView):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get']
    def get(self, request, uidb64, token):
        username = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(username=username)
        if tokenGenerator.check_token(user, token):
            user.is_active = True
            user.save()
            createdCalendar = Calendar(
                calendarID = "",
                name = "Personal"
            )
            createdCalendar.save()
            createdCalendar.users.add(user)
            CalendarColor.objects.create(
                calendarID=createdCalendar.calendarID,
                user=user.get_username(),
                color=defaultColor
            )
            return HttpResponse("Email activated")
        else:
            return HttpResponse("Wrong token")



class LoginView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data,
            context={ 'request': self.request })
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response(None, status=status.HTTP_202_ACCEPTED)
        else:
            if User.objects.filter(username=request.data['username']).exists():
                user = User.objects.get(username=request.data['username'])
                if not user.is_active:
                    return Response({"message": "Please activate your account first!"}, status=status.HTTP_403_FORBIDDEN)
            return Response({"message": "Invalid Username/Password"}, status=status.HTTP_403_FORBIDDEN)
        

class LogoutView(APIView):
    def post(self, request, format=None):
        logout(request)
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class ProfileView(APIView):
    def get(self, request):
        user = get_user(request)
        return JsonResponse({
            'email': user.get_username(),
            'full_name': user.get_full_name(),
            'first_name': user.get_short_name()
        }, status=status.HTTP_200_OK)
    def post(self, request):
        user = get_user(request)
        password = request.data["password"]
        user.set_password(password)
        user.save()
        login(request, user)
        return Response(None, status=status.HTTP_200_OK)

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
                CalendarColor.objects.create(
                    calendarID=Calendar.objects.get(pk=request.data["field"]).calendarID,
                    user=user.get_username(),
                    color=defaultColor
                )
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
            CalendarColor.objects.create(
                calendarID=createdID,
                user=user.get_username(),
                color=defaultColor
            )
            return Response({'calendarID': createdID}, status=status.HTTP_201_CREATED)

class CalendarColorView(APIView):
    def get(self, request):
        username = get_user(request).get_username()
        queryset = CalendarColor.objects.filter(user = username)
        data = CalendarColorSerializer(queryset, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
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
                continue
        return Response(None, status=status.HTTP_200_OK)

class SessionView(APIView):
    @staticmethod
    def get(request, format=None):
        return JsonResponse({'isAuthenticated': True})


