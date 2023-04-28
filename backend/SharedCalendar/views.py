import json
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import viewsets, status, permissions
from .serializers import EventSerializer, UserSerializer, LoginSerializer, CalendarColorSerializer, JournalEntrySerializer
from .models import Calendar, Event, CalendarColor, Journal, JournalEntry
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
from django.core import serializers
import string
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import render
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

def render_react(request):
    return render(request, "index.html")

class EventView(APIView):
    http_method_names = ['get', 'post', 'delete', 'patch']
    def get(self, request):
        user = request.user
        serializer_class = EventSerializer
        calendars = user.calendar_set.values_list('calendarID')
        compiledData = []
        queryset = Event.objects.filter(calendarID__in=calendars)
        compiledData = serializer_class(queryset, many=True).data   
        return Response(compiledData, status=status.HTTP_200_OK)
    
    def post(self, request):
        targetCalendar = Calendar.objects.get(calendarID=request.data["calendarID"])
        members = targetCalendar.users.all()
        # request.data._mutable = True
        while True:
            newTag = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
            if not Event.objects.filter(tag = newTag).exists():
                break
        for member in members:
            request.data["id"] = ""
            while not request.data["id"]:
                newID = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
                if not Event.objects.filter(pk=newID).exists():
                    request.data["id"] = newID
                    request.data["tag"] = newTag
            event = Event.objects.create(
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
                owner = member.get_username(),
                attendee = member.get_short_name()
            )
            calendars = Calendar.objects.filter(users=member).all()
            for calendar in calendars:
                event.calendarID.add(calendar)
        return Response(None, status=status.HTTP_201_CREATED)   
    
    def delete(self, request):
        id = request.GET.get("id", "")
        if Event.objects.filter(id=id).exists():
            Event.objects.filter(id = id).delete()
        return Response(None, status=status.HTTP_200_OK)
    
    def patch(self, request):
        id = request.GET.get("id", "")
        events = Event.objects.filter(id = id)
        for event in events:
            serializer = EventSerializer(event, data=request.data, partial=True) 
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(None, status=status.HTTP_400_BAD_REQUEST)
        return Response(None, status=status.HTTP_200_OK)

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
                name = "Personal",
                isPersonal = True
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
    http_method_names = ['post']
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
    http_method_names = ['post']
    def post(self, request, format=None):
        logout(request)
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class ProfileView(APIView):
    http_method_names = ['get', 'post']
    def get(self, request):
        user = request.user
        return JsonResponse({
            'email': user.get_username(),
            'full_name': user.get_full_name(),
            'first_name': user.get_short_name()
        }, status=status.HTTP_200_OK)
    def post(self, request):
        user = request.user
        password = request.data["password"]
        user.set_password(password)
        user.save()
        login(request, user)
        return Response(None, status=status.HTTP_200_OK)

class CalendarView(APIView):
    http_method_names = ['get', 'post']
    def get(self, request):
        user = request.user
        calendars = Calendar.objects.filter(users = user)
        data = []
        for calendar in calendars:
            user_list = []
            for groupUser in calendar.users.all():
                user_list.append(groupUser.get_short_name())
                    
            data.append({
                "calendarID": calendar.calendarID,
                "groupName": calendar.name,
                "isPersonal": calendar.isPersonal,
                "isAnonymous": calendar.isAnonymous,
                "journals": calendar.journals.all().values_list(),
                "users": user_list
            })
        return Response(data, status=status.HTTP_200_OK)
    def post(self, request):
        user = request.user
        if request.data["choice"] == "join":
            if Calendar.objects.filter(calendarID = request.data["field"]).exists():
                if Calendar.objects.get(calendarID = request.data["field"]).isPersonal:
                    return Response({"Error": "Personal Groups cannot be shared!"}, status=status.HTTP_406_NOT_ACCEPTABLE)
                if user in Calendar.objects.get(calendarID = request.data["field"]).users.all():
                    return Response({"Error": "Group has been added!"}, status=status.HTTP_406_NOT_ACCEPTABLE)
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
            if request.data["choice"] != "create" and request.data["choice"] != "create-anon":
                return Response({"Error": "Invalid Choice"}, status=status.HTTP_406_NOT_ACCEPTABLE)
            isAnonymous = False
            if request.data["choice"] == "create-anon":
                isAnonymous = True
            createdCalendar = Calendar(
                calendarID = "",
                name = request.data["field"],
                isAnonymous = isAnonymous
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
    http_method_names = ['get', 'post']
    def get(self, request):
        username = request.user.get_username()
        queryset = CalendarColor.objects.filter(user = username)
        data = CalendarColorSerializer(queryset, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        username = request.user.get_username()
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
    http_method_names = ['get']
    @staticmethod
    def get(request, format=None):
        return JsonResponse({'isAuthenticated': True})

class JournalView(APIView):
    http_method_names = ['get', 'post', 'delete', 'patch']
    def get(self, request):
        data = {}
        user = request.user
        calendars = user.calendar_set.all()
        for calendar in calendars:
            journals = calendar.journals.all()
            data[calendar.calendarID] = {}
            for journal in journals:
                entries = JournalEntry.objects.filter(journalID=journal.journalID).order_by("-date").values()
                data[calendar.calendarID][journal.journalID] = entries
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, type, id):
        if type == 'e':
            author = request.user.get_short_name()
            title = request.data["title"]
            description = request.data["description"]
            entry = JournalEntry.objects.create(
                title = title,
                description = description,
                journalID = id,
                author = author,
            )
            data = json.loads(serializers.serialize('json', [entry]))[0]['fields']
            data['entryID'] = entry.entryID
            return Response(data, status=status.HTTP_201_CREATED)
        elif type == 'j':
            name = request.data["name"]
            newJournal = Journal.objects.create(
                name = name
            )
            calendar = Calendar.objects.get(calendarID=request.data["group"])
            calendar.journals.add(newJournal)
            return Response({"journalID": newJournal.journalID}, status=status.HTTP_201_CREATED)

    def delete(self, request, type, id):
        if type == 'e':
            JournalEntry.objects.get(entryID=id).delete()
            return Response(None, status=status.HTTP_200_OK)
        elif type == 'j':
            journal = Journal.objects.get(journalID=id)
            JournalEntry.objects.filter(journalID=id).delete()
            Calendar.objects.get(journals = journal).journals.remove(journal)
            journal.delete()
            return Response(None, status=status.HTTP_200_OK)
        



