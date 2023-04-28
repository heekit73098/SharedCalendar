import axios from "axios";
import { config, API_URL } from "./utils"

class ProfileService {
    getProfile(token: string) {
        return (
            axios.get(API_URL + "profile/", {
                headers: {
                    "Authorization": "Token " + token
                }
            })
        )
    }

    addCalendar(event: {}, token: string) {
        return (
            axios.post(API_URL + "calendarConfig/", event, {
                headers: {
                    "Authorization": "Token " + token
                }
            })
        )
    }

    getCalendars(token: string) {
        return (
            axios.get(API_URL + "calendarConfig/", {
                headers: {
                    "Authorization": "Token " + token
                }
            })
        )
    }

    changeColors(data: {}, token: string) {
        return (
            axios.post(API_URL + "color/", data, {
                headers: {
                    "Authorization": "Token " + token
                }
            })
        )
    }

    getColors(token: string) {
        return (
            axios.get(API_URL + "color/", {
                headers: {
                    "Authorization": "Token " + token
                }
            })
        )
    }
}

export default new ProfileService();