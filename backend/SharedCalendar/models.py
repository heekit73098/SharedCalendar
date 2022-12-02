from django.db import models
from django.utils.crypto import get_random_string
import string




# Create your models here.

class Event(models.Model):
    calendarId = models.TextField(null=False)
    id = models.TextField(primary_key=True, blank=True, unique=True)
    title = models.TextField(null=False)
    isAllday = models.BooleanField()
    start = models.TextField(null=False)
    end = models.TextField(null=False)
    category = models.TextField()
    dueDateClass = models.TextField(blank=True)
    location = models.TextField(blank=True)
    state = models.TextField()
    isPrivate = models.BooleanField()

    def save(self, *args, **kwargs):  
        while not self.id:
            newID = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
            if not Event.objects.filter(pk=newID).exists():
                self.id = newID

        super().save(*args, **kwargs)
        

    def __str__(self) -> str:
        return self.title

class User(models.Model):
    email = models.TextField(primary_key=True, unique=True)
    name = models.TextField()
    saltedPassword = models.TextField()
