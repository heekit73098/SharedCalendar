"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from SharedCalendar import views

router = routers.DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', views.UserCreate.as_view()),
    path('api/calendar/', views.EventView.as_view()),
    path('api/color/', views.CalendarColorView.as_view()),
    path('api/login/', views.LoginView.as_view()),
    path('api/logout/', views.LogoutView.as_view()),
    path('api/session/', views.SessionView.as_view()),
    path('api/profile/', views.ProfileView.as_view()),
    path('api/calendarConfig/', views.CalendarView.as_view()),
    path('activate/<str:uidb64>/<str:token>/', views.ActivateView.as_view(), name='activate'),
    path('api/journal/', views.JournalView.as_view()),
    path('api/journal/<str:type>/<str:id>/', views.JournalView.as_view()),
]
