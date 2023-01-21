import axios from "axios";

const API_URL = "https://qwerty73098.pythonanywhere.com/api/journal/"

const config = {
    withCredentials:true,
    xsrfHeaderName:"X-CSRF-TOKEN", 
    xsrfCookieName: "csrftoken" 
}

class JournalService {
    addJournal(name:string, group:string) {
        return (
            axios.post(API_URL + "j/add/", {name, group}, config)
        )
    }

    addEntry(journalID:string, title:string, description:string) {
        return (
            axios.post(API_URL + "e/" + journalID + "/", {title, description}, config)
        )
    }

    getEntries() {
        return (
            axios.get(API_URL, config)
        )
    }

    deleteEntry(entryID: string) {
        return (
            axios.delete(API_URL + "e/" + entryID + "/", config)
        )
    }

    deleteJournal(journalID: string) {
        return (
            axios.delete(API_URL + "j/" + journalID + "/", config)
        )
    }
}

export default new JournalService()