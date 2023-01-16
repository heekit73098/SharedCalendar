from django.db.utils import IntegrityError
from django.test import TestCase, Client
from django.urls import reverse
from .models import Calendar, Event, CalendarColor
from django.contrib.auth.models import User
from .views import EventView

# Create your tests here.

class TestEvent(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        for i in range(5):
            obj = Event.objects.create(
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
    def test_view_fail_no_credentials(self):
        response = Client().get("/api/calendar/") 
        self.assertEqual(response.status_code, 403)


class TestCalendar(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        for i in range(5):
            User.objects.create(
                username = str(i),
                password = str(i) * 8,
                email = str(i) + "@" + str(i) + ".com"

            )
        for i in range(5):
            Calendar.objects.create(
                calendarID = str(i),
                name = "cal" + str(i),
            )
    
    def test_add_same_id_calendar_failure(self):
        try:
            Calendar.objects.create(
                calendarID = "0",
                name = "same",
            )
            self.fail("Exception should be raised")
        except IntegrityError:
            pass

    def test_get_calendarID_success(self):
        cal = Calendar.objects.get(calendarID="0")
        self.assertEqual(cal.name, "cal0")

class TestCalendarColor(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        for i in range(5):
            CalendarColor.objects.create(
                calendarID = str(i),
                user = str(i),
                color = "#" + str(i)*6
            )
    
    def test_add_same_calendar_success(self):
        try:
            CalendarColor.objects.create(
                calendarID = "0",
                user = "1",
                color = "#" + "1"*6
            )
        except Exception:
            self.fail("Should succeed")
    
    def test_add_same_calendar_user_failure(self):
        try:
            CalendarColor.objects.create(
                calendarID = "0",
                user = "0",
                color = "#" + "1"*6
            )
            self.fail("Exception should be raised")
        except Exception:
            pass

    


