import axios from "axios";

const API_URL = "https://qwerty73098.pythonanywhere.com/api/calendar/"
const DEV_API_URL = "http://localhost:8000/api/"

type CalendarEvent = {
    calendarID: string; 
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
        return (axios.get(DEV_API_URL, config))
    }

    deleteEvent(id: string) {
        return (axios.delete(DEV_API_URL + '?id=' + id, config))
    }

    createEvent(event: CalendarEvent) {
        return (axios.post(DEV_API_URL, event, config))
    }

    updateEvent(id: string, changes: {}) {
        return (axios.patch(DEV_API_URL + '?id=' + id, changes, config))
    }
}

export default new CalendarService();
