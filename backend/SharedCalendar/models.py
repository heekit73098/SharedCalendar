from django.db import models
from django.utils.crypto import get_random_string
import string




# Create your models here.

class SharedCalendar(models.Model):
    calendarId = models.TextField()
    id = models.TextField(primary_key=True, blank=True, unique=True)
    title = models.TextField()
    isAllday = models.BooleanField()
    start = models.TextField()
    end = models.TextField()
    category = models.TextField()
    dueDateClass = models.TextField(blank=True)
    location = models.TextField(blank=True)
    state = models.TextField()
    isPrivate = models.BooleanField()

    def save(self, *args, **kwargs):  
        while not self.id:
            newID = get_random_string(6, allowed_chars=string.ascii_uppercase + string.digits)
            if not SharedCalendar.objects.filter(pk=newID).exists():
                self.id = newID

        super().save(*args, **kwargs)
        

    def __str__(self) -> str:
        return self.title
