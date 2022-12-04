from django.db.utils import IntegrityError
from django.test import TestCase, Client
from django.urls import reverse
from .models import Event
from .views import EventView

# Create your tests here.

class TestEvent(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        for i in range(5):
            Event.objects.create(
                calendarId = "0",
                id = str(i),
                title = "test" + str(i),
                isAllday = False,
                category = "cat",
                dueDateClass = "",
                location = "",
                state = "busy",
                isPrivate = False
            )
    
    def test_create_same_id_failure(self):
        try:
            Event.objects.create(
                calendarId = "0",
                id = "0",
                title = "test0",
                isAllday = False,
                start = "time",
                end = "time",
                category = "cat",
                dueDateClass = "",
                location = "",
                state = "busy",
                isPrivate = False
            )
            self.fail("Exception should be raised")
        except IntegrityError:
            pass

    def test_get_id_success(self):
        event = Event.objects.get(id="0")
        self.assertEqual(event.end, "")

class TestView(TestCase):
    def test_view(self):
        response = Client().get("/api/calendar/") 
        self.assertEqual(response.status_code, 200)


