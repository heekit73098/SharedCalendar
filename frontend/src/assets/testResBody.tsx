
export default class Constants {
    // Define the constants as static properties of the class
    static readonly GET_EVENTS_BODY = [
        {
            "calendarID": [
                "A234567",
                "B123456",
                "C123456"
            ],
            "id": "2QYY6Z",
            "title": "ZOO",
            "isAllday": true,
            "start": "Wed Dec 14 2022 12:00:00 GMT+0800 (Singapore Standard Time)",
            "end": "Wed Dec 14 2022 13:00:00 GMT+0800 (Singapore Standard Time)",
            "category": "allday",
            "dueDateClass": "",
            "location": "",
            "state": "Busy",
            "isPrivate": false,
            "tag": "7EQMGS",
            "owner": "test@test.com",
            "attendee": "anyone"
        },
        {
            "calendarID": [
                "A234567",
                "B123456",
                "C123456"
            ],
            "id": "Q2VOCZ",
            "title": "Birthday",
            "isAllday": true,
            "start": "Wed Dec 21 2022 12:00:00 GMT+0800 (Singapore Standard Time)",
            "end": "Wed Dec 21 2022 13:00:00 GMT+0800 (Singapore Standard Time)",
            "category": "allday",
            "dueDateClass": "",
            "location": "",
            "state": "Busy",
            "isPrivate": false,
            "tag": "2V8YF0",
            "owner": "test@test.com",
            "attendee": "anyone"
        }
    ];
    static readonly GET_COLOR_BODY = [
        {
            "calendarID":"J3TDLR",
            "user":"test@test.com",
            "color":"#cddc39"
        },
        {
            "calendarID":"2DYKZP",
            "user":"test@test.com",
            "color":"#f44336"
        }
    ];

    static readonly GET_CALENDAR_BODY = [
        {"calendarID":"J3TDLR","groupName":"Personal"},
        {"calendarID":"2DYKZP","groupName":"TestCal"}
    ];

    static readonly GET_PROFILE_BODY = {"email": "test@test.com", "full_name": "John Tan"}
  }
