from django.db import models
from django.utils.crypto import get_random_string
from django.contrib.auth.models import User
import string

# Create your models here.

User._meta.get_field('email')._unique = True
User._meta.get_field('email').blank = False
User._meta.get_field('email').null = False

class Event(models.Model):
    calendarId = models.TextField(null=False)
    id = models.TextField(primary_key=True, unique=True, blank=True)
    title = models.TextField(null=False)
    isAllday = models.BooleanField()
    start = models.TextField(null=False)
    end = models.TextField(null=False)
    category = models.TextField()
    dueDateClass = models.TextField(blank=True)
    location = models.TextField(blank=True)
    state = models.TextField()
    isPrivate = models.BooleanField()
    tag = models.TextField(blank=True)
    owner = models.TextField()

    def __str__(self) -> str:
        return self.title

class Calendar(models.Model):
    calendarID = models.TextField(primary_key=True, blank=True, unique=True)
    name = models.TextField()
    users = models.ManyToManyField(User)

    def save(self, *args, **kwargs):  
        while not self.calendarID:
            newID = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
            if not Calendar.objects.filter(pk=newID).exists():
                self.calendarID = newID
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.calendarID

#TODO Add validation for hex colour
class CalendarColor(models.Model):
    calendarID = models.TextField()
    user = models.TextField()
    color = models.TextField()
    
    class Meta:
        unique_together = ("calendarID", "user")






