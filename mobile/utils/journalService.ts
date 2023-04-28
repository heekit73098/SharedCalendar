import axios from "axios";
import { config, API_URL } from "./utils"

class JournalService {
    addJournal(name:string, group:string) {
        return (
            axios.post(API_URL + "journal/j/add/", {name, group}, config)
        )
    }

    addEntry(journalID:string, title:string, description:string) {
        return (
            axios.post(API_URL + "journal/e/" + journalID + "/", {title, description}, config)
        )
    }

    getEntries() {
        return (
            axios.get(API_URL + "journal/", config)
        )
    }

    deleteEntry(entryID: string) {
        return (
            axios.delete(API_URL + "journal/e/" + entryID + "/", config)
        )
    }

    deleteJournal(journalID: string) {
        return (
            axios.delete(API_URL + "journal/j/" + journalID + "/", config)
        )
    }
}

export default new JournalService()