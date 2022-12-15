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

const config = {
    withCredentials:true,
    xsrfHeaderName:"X-CSRFTOKEN", 
    xsrfCookieName: "csrftoken" 
}

class CalendarService {
    
    refreshList() {
        return (axios.get(API_URL, config))
    }

    deleteEvent(tag: string) {
        return (axios.delete(API_URL + '?tag=' + tag, config))
    }

    createEvent(event: CalendarEvent) {
        return (axios.post(API_URL, event, config))
    }

    createEvents(events: CalendarEvent[]) {
        return (axios.post(API_URL + "multi/", events, config))
    }

    updateEvent(tag: string, changes: {}) {
        return (axios.patch(API_URL + '?tag=' + tag, changes, config))
    }
}

export default new CalendarService();
