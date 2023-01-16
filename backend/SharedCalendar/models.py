from django.db import models
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.contrib.auth.models import User
import string

# Create your models here.

User._meta.get_field('email')._unique = True
User._meta.get_field('email').blank = False
User._meta.get_field('email').null = False

class Journal(models.Model):
    journalID = models.TextField(primary_key=True, blank=True)
    name = models.TextField()

    def __str__(self) -> str:
        return self.name
    
    def save(self, *args, **kwargs):  
        while not self.journalID:
            newID = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
            if not Journal.objects.filter(pk=newID).exists():
                self.journalID = newID
        super().save(*args, **kwargs)

class Calendar(models.Model):
    calendarID = models.TextField(primary_key=True, blank=True)
    name = models.TextField()
    users = models.ManyToManyField(User)
    isPersonal = models.BooleanField(default=False)
    isAnonymous = models.BooleanField(default=False)
    journals = models.ManyToManyField(Journal, blank=True)

    def save(self, *args, **kwargs):  
        if self.isPersonal:
            prefix = "A"
        elif not self.isAnonymous:
            prefix = "B"
        else:
            prefix = "C"
        while not self.calendarID:
            newID = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
            if not Calendar.objects.filter(pk=newID).exists():
                self.calendarID = prefix + newID
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.calendarID

class Event(models.Model):
    calendarID = models.ManyToManyField(Calendar)
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
    attendee = models.TextField()

    def __str__(self) -> str:
        return self.title

#TODO Add validation for hex colour
class CalendarColor(models.Model):
    calendarID = models.TextField()
    user = models.TextField()
    color = models.TextField()
    
    class Meta:
        unique_together = ("calendarID", "user")

class JournalEntry(models.Model):
    entryID = models.TextField(primary_key=True)
    journalID = models.TextField()
    author = models.TextField()
    title = models.TextField()
    description = models.TextField()
    date = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return self.title
    
    def save(self, *args, **kwargs):  
        while not self.entryID:
            newID = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
            if not JournalEntry.objects.filter(pk=newID).exists():
                self.entryID = newID
        super().save(*args, **kwargs)







