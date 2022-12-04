from rest_framework import viewsets, status, permissions
from .serializers import EventSerializer, UserSerializer, LoginSerializer
from .models import Event
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token

# Create your views here.

class EventView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    

class UserCreate(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ['post']
    serializer_class = UserSerializer
    queryset = User.objects.all()
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
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

def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response



class SessionView(APIView):
    @staticmethod
    def get(request, format=None):
        return JsonResponse({'isAuthenticated': True})


