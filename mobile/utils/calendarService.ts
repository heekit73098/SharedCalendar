import axios from "axios";
import { config, API_URL } from "./utils"

export type CalendarEvent = {
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

export type CalendarData = {
    'calendarID': string,
    'groupName': string,
    'isPersonal': boolean,
    'isAnonymous': boolean,
    'journals': string[][]
}

export type CalendarConfig = {
    id: string,
    name: string,
    color: string
}


class CalendarService {
    
    refreshList(token: string) {
        console.log(token)
        return (axios.get(API_URL + "calendar/", {
            headers: {
                "Authorization": "Token " + token
            }
        } ))
    }

    deleteEvent(id: string, token: string) {
        return (axios.delete(API_URL + 'calendar/?id=' + id, {
            headers: {
                "Authorization": "Token " + token
            }
        }))
    }

    createEvent(event: CalendarEvent, token: string) {
        return (axios.post(API_URL+ "calendar/", event, {
            headers: {
                "Authorization": "Token " + token,
                // 'Content-Type': 'multipart/form-data'
            }
        }))
    }

    updateEvent(id: string, changes: {}, token: string) {
        return (axios.patch(API_URL + 'calendar/?id=' + id, changes, {
            headers: {
                "Authorization": "Token " + token
            }
        }))
    }
}

export default new CalendarService();
