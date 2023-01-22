import axios from "axios";
import { config, API_URL } from "./utils"

class ProfileService {
    getProfile() {
        return (
            axios.get(API_URL + "profile/", config)
        )
    }

    addCalendar(event: {}) {
        return (
            axios.post(API_URL + "calendarConfig/", event, config)
        )
    }

    getCalendars() {
        return (
            axios.get(API_URL + "calendarConfig/", config)
        )
    }

    changeColors(data: {}) {
        return (
            axios.post(API_URL + "color/", data, config)
        )
    }

    getColors() {
        return (
            axios.get(API_URL + "color/", config)
        )
    }
}

export default new ProfileService();