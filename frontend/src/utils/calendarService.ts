import axios from "axios";
import { config, API_URL } from "./utils"

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

class CalendarService {
    
    refreshList() {
        return (axios.get(API_URL + "calendar/", config))
    }

    deleteEvent(id: string) {
        return (axios.delete(API_URL + 'calendar/?id=' + id, config))
    }

    createEvent(event: CalendarEvent) {
        return (axios.post(API_URL+ "calendar/", event, config))
    }

    updateEvent(id: string, changes: {}) {
        return (axios.patch(API_URL + 'calendar/?id=' + id, changes, config))
    }
}

export default new CalendarService();
