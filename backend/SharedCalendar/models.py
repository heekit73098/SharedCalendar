from django.db import models

# Create your models here.

class SharedCalendar(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    datetime = models.DateTimeField()

    def __str__(self) -> str:
        return self.title
