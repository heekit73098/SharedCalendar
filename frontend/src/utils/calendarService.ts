import axios from "axios";

const API_URL = "http://localhost:8000/api/calendar/"

type CalendarEvent = {
    calendarId: string; 
    id: string; 
    title: string | undefined; 
    isAllday: boolean | undefined; 
    start: string | undefined; 
    end: string | undefined; 
    category: string; 
    dueDateClass: string; 
    location: string | undefined; 
    state: string | undefined; 
    isPrivate: boolean | undefined; 
    tag:string
  }

class CalendarService {
    
    refreshList() {
        return (axios.get(API_URL, { 
            withCredentials:true, 
            xsrfHeaderName:"X-CSRFTOKEN", 
            xsrfCookieName: "csrftoken" 
        })  
        )
    }

    deleteEvent(tag: string) {
        return (axios.delete(API_URL + '?tag=' + tag, { 
            withCredentials:true, 
            xsrfHeaderName:"X-CSRFTOKEN", 
            xsrfCookieName: "csrftoken" 
        })
        )
    }

    createEvent(event: CalendarEvent) {
        return (axios.post(API_URL, event, { 
            withCredentials:true, 
            xsrfHeaderName:"X-CSRFTOKEN", 
            xsrfCookieName: "csrftoken" 
        })
        )
    }

    createEvents(events: CalendarEvent[]) {
        return (axios.post(API_URL + "multi/", events, { 
            withCredentials:true, 
            xsrfHeaderName:"X-CSRFTOKEN", 
            xsrfCookieName: "csrftoken" 
        })
        )
    }

    updateEvent(tag: string, changes: {}) {
        return (axios.patch(API_URL + '?tag=' + tag, changes, { 
        withCredentials:true, 
        xsrfHeaderName:"X-CSRFTOKEN", 
        xsrfCookieName: "csrftoken" 
        })
        )
    }
}

export default new CalendarService();
