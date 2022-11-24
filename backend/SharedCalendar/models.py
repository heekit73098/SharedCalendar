from django.db import models

# Create your models here.

class SharedCalendar(models.Model):
    calendarId = models.TextField()
    id = models.TextField(primary_key=True)
    title = models.TextField()
    isAllday = models.BooleanField()
    start = models.TextField()
    end = models.TextField()
    category = models.TextField()
    dueDateClass = models.TextField(blank=True)
    location = models.TextField(blank=True)
    state = models.TextField()
    isPrivate = models.BooleanField()

    def __str__(self) -> str:
        return self.title
