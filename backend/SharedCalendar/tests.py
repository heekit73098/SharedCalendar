from django.db.utils import IntegrityError
from django.test import TestCase, Client
from django.urls import reverse
from .models import Calendar, Event, CalendarColor
from django.contrib.auth.models import User
from .views import EventView
from rest_framework.test import APIClient
from rest_framework import status

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

class TestEventView(TestCase): 
    
    def setUp(self) -> None:
        self.user = User.objects.create(
            username = "testUser",
            password = "12345678",
            email =  "test@test.com"
        )
        self.client = APIClient()
        self.url = reverse("calendar")
        self.calendar = Calendar.objects.create(
            name="testCal",
        )
        self.calendar.users.add(self.user)
        self.event = Event.objects.create(
            id = "",
            title = "title",
            isAllday = True,
            start = "start",
            end = "end",
            category = "category",
            dueDateClass = "dueDateClass",
            location = "location",
            state = "state",
            isPrivate = True,
            tag = "tag",
            owner = self.user.get_username(),
            attendee = self.user.get_short_name()
        )

    def test_get_event_failure(self):
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_get_event_success(self):
        self.client.force_login(self.user)
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
    
    def test_post_event_success(self):
        self.client.force_login(self.user)
        data = {
            "id": "",
            "title": "title",
            "isAllday": True,
            "start" :"start",
            "end": "end",
            "category": "category",
            "dueDateClass": "dueDateClass",
            "location": "location",
            "state": "state",
            "isPrivate": True,
            "tag": "tag",
            "owner": self.user.get_username(),
            "attendee": self.user.get_short_name(),
            "calendarID": self.calendar.calendarID,
        }
        res = self.client.post(self.url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_patch_event_success(self):
        self.client.force_login(self.user)
        data = {
            "title": "new_title",
            "isAllday": False,
            "start" :"start2",
            "end": "end2",
        }
        res = self.client.patch(self.url + "?id=" + self.event.id, data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_patch_event_failure(self):
        self.client.force_login(self.user)
        data = {
            "title": "new_title",
            "isAllday": "123",
            "end": "end2",
        }
        res = self.client.patch(self.url + "?id=" + self.event.id, data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_event_success(self):
        self.client.force_login(self.user)
        res = self.client.delete(self.url + "?id=" + self.event.id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

class TestLoginView(TestCase): 
    
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            username = "testUser",
            password = "12345678",
            email =  "test@test.com"
        )
        self.client = APIClient()
        self.url = reverse("login")
    
    def test_login_success(self):
        data = {
            "username": "testUser",
            "password": "12345678",
        }
        res = self.client.post(self.url, data)
        self.assertEqual(res.status_code, status.HTTP_202_ACCEPTED)

    def test_login_failure(self):
        data = {
            "username": "testUser",
            "password": "wrong",
        }
        res = self.client.post(self.url, data)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

class TestProfileView(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            username = "testUser",
            password = "12345678",
            email =  "test@test.com"
        )
        self.client = APIClient()
        self.url = reverse("profile")

    def test_get_profile_success(self):
        self.client.force_login(self.user)
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
    
    def test_get_profile_failure(self):
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
    
class TestCalendarView(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username = "testUser",
            password = "12345678",
            email =  "test@test.com"
        )
        self.client = APIClient()
        self.url = reverse("calendarConfig")
        self.calendar = Calendar.objects.create(
            name="testCal",
        )
        self.event = Event.objects.create(
            id = "",
            title = "title",
            isAllday = True,
            start = "start",
            end = "end",
            category = "category",
            dueDateClass = "dueDateClass",
            location = "location",
            state = "state",
            isPrivate = True,
            tag = "tag",
            owner = self.user.get_username(),
            attendee = self.user.get_short_name()
        )
    
    def test_get_calendar_success(self):
        self.client.force_login(self.user)
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
    
    def test_get_calendar_failure(self):
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_calendar_join_success(self):
        self.client.force_login(self.user)
        data = {
            "choice": "join",
            "field": self.calendar.calendarID
        }
        res = self.client.post(self.url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_post_calendar_create_success(self):
        self.client.force_login(self.user)
        data = {
            "choice": "create",
            "field": "testtest"
        }
        res = self.client.post(self.url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_post_calendar_join_failure(self):
        self.client.force_login(self.user)
        data = {
            "choice": "join",
            "field": self.calendar.calendarID
        }
        self.calendar.users.add(self.user)
        res = self.client.post(self.url, data)
        self.assertEqual(res.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_post_calendar_others_failure(self):
        self.client.force_login(self.user)
        data = {
            "choice": "invalid",
            "field": self.calendar.calendarID
        }
        res = self.client.post(self.url, data)
        self.assertEqual(res.status_code, status.HTTP_406_NOT_ACCEPTABLE)

class TestCalendarColorView(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            username = "testUser",
            password = "12345678",
            email =  "test@test.com"
        )
        self.client = APIClient()
        self.url = reverse("color")
        self.calendar = Calendar.objects.create(
            name="testCal",
        )
        self.event = Event.objects.create(
            id = "",
            title = "title",
            isAllday = True,
            start = "start",
            end = "end",
            category = "category",
            dueDateClass = "dueDateClass",
            location = "location",
            state = "state",
            isPrivate = True,
            tag = "tag",
            owner = self.user.get_username(),
            attendee = self.user.get_short_name()
        )

    def test_post_color_success(self):
        self.client.force_login(self.user)
        data = {
            self.calendar.calendarID: "123456"
        }
        res = self.client.post(self.url, data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_color_success(self):
        self.client.force_login(self.user)
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
    
    def test_get_color_failure(self):
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
