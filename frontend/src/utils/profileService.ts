import axios from "axios";

const API_URL = "https://qwerty73098.pythonanywhere.com/api/"
const DEV_API_URL = "http://localhost:8000/api/"
const config = {
    withCredentials:true,
    xsrfHeaderName:"X-CSRFTOKEN", 
    xsrfCookieName: "csrftoken" 
}

class ProfileService {
    getProfile() {
        return (
            axios.get(DEV_API_URL + "profile/", config)
        )
    }

    addCalendar(event: {}) {
        return (
            axios.post(DEV_API_URL + "calendarConfig/", event, config)
        )
    }

    getCalendars() {
        return (
            axios.get(DEV_API_URL + "calendarConfig/", config)
        )
    }

    changeColors(data: {}) {
        return (
            axios.post(DEV_API_URL + "color/", data, config)
        )
    }

    getColors() {
        return (
            axios.get(DEV_API_URL + "color/", config)
        )
    }
}

export default new ProfileService();