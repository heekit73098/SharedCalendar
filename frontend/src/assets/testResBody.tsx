
export default class Constants {
    // Define the constants as static properties of the class
    static readonly GET_EVENTS_BODY = [
        {
            "calendarId":"J3TDLR",
            "id":"6217BM",
            "title":"ZOO",
            "isAllday":false,
            "start":"Sun Dec 11 2022 09:00:00 GMT+0800 (Singapore Standard Time)",
            "end":"Sun Dec 11 2022 18:01:00 GMT+0800 (Singapore Standard Time)",
            "category":"time",
            "dueDateClass":"",
            "location":"",
            "state":"Busy",
            "isPrivate":false,
            "tag":"6217BM",
            "owner":"anyone"
        },
        {
            "calendarId":"2DYKZP",
            "id":"LRS2VF",
            "title":"Birthday",
            "isAllday":true,
            "start":"Sat Dec 17 2022 12:00:00 GMT+0800 (Singapore Standard Time)",
            "end":"Sat Dec 17 2022 13:00:00 GMT+0800 (Singapore Standard Time)",
            "category":"allday",
            "dueDateClass":"",
            "location":"",
            "state":"Busy",
            "isPrivate":false,
            "tag":"LRS2VF",
            "owner":"anyone"
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
        ["J3TDLR","Personal"],
        ["2DYKZP","TestCal"]
    ];

    static readonly GET_PROFILE_BODY = {"email": "test@test.com", "full_name": "John Tan"}
  }
