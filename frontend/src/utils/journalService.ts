import axios from "axios";

const API_URL = "https://qwerty73098.pythonanywhere.com/api/journal/"
const DEV_API_URL = "http://localhost:8000/api/"

const config = {
    withCredentials:true,
    xsrfHeaderName:"X-CSRFTOKEN", 
    xsrfCookieName: "csrftoken" 
}

class JournalService {
    addJournal(name:string, group:string) {
        return (
            axios.post(DEV_API_URL + "j/add/", {name, group}, config)
        )
    }

    addEntry(journalID:string, title:string, description:string) {
        return (
            axios.post(DEV_API_URL + "e/" + journalID + "/", {title, description}, config)
        )
    }

    getEntries() {
        return (
            axios.get(DEV_API_URL, config)
        )
    }

    deleteEntry(entryID: string) {
        return (
            axios.delete(DEV_API_URL + "e/" + entryID + "/", config)
        )
    }

    deleteJournal(journalID: string) {
        return (
            axios.delete(DEV_API_URL + "j/" + journalID + "/", config)
        )
    }
}

export default new JournalService()