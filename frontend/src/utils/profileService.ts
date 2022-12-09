import axios from "axios";

const API_URL = "http://localhost:8000/api/"

class ProfileService {
    getProfile() {
        return (
            axios.get(API_URL + "profile/", {
                withCredentials:true,
                xsrfHeaderName:"X-CSRFTOKEN", 
                xsrfCookieName: "csrftoken" 
            })
        )
    }

    addCalendar(event: {}) {
        return (
            axios.post(API_URL + "calendarConfig/", event, { 
                withCredentials:true, 
                xsrfHeaderName:"X-CSRFTOKEN", 
                xsrfCookieName: "csrftoken" 
            })
        )
    }

    getCalendars() {
        return (
            axios.get(API_URL + "calendarConfig/", {
                withCredentials:true, 
                xsrfHeaderName:"X-CSRFTOKEN", 
                xsrfCookieName: "csrftoken" 
            })
        )
    }

    changeColors(data: {}) {
        return (
            axios.post(API_URL + "color/", data, {
                withCredentials:true, 
                xsrfHeaderName:"X-CSRFTOKEN", 
                xsrfCookieName: "csrftoken" 
            })
        )
    }

    getColors() {
        return (
            axios.get(API_URL + "color/", {
                withCredentials:true, 
                xsrfHeaderName:"X-CSRFTOKEN", 
                xsrfCookieName: "csrftoken" 
            })
        )
    }
}

export default new ProfileService();