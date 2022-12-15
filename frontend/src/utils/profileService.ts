import axios from "axios";

const API_URL = "http://localhost:8000/api/"
const config = {
    withCredentials:true,
    xsrfHeaderName:"X-CSRFTOKEN", 
    xsrfCookieName: "csrftoken" 
}

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