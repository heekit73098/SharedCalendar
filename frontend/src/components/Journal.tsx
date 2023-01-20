import { useEffect, useState } from "react";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import ProfileService from '../utils/profileService';
import NavBar from "./NavBar";
import JournalLayout from "./JournalLayout";
import JournalService from "../utils/journalService";
import { useNavigate } from "react-router-dom";

type Group = {
    id: string,
    name: string,
    color: string,
    journals: string[][]
}

type CalendarData = {
    'calendarID': string,
    'groupName': string,
    'isPersonal': boolean,
    'isAnonymous': boolean,
    'journals': string[][]
  }

export default function Journal() {  
    const navigate = useNavigate()
    const [groups, setGroups] = useState<Group[]>([])
    const [entries, setEntries] = useState<{ [id: string] : {} }>({})
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        ProfileService.getCalendars().then(res => {
            var groupArray: Group[] = []
            res.data.forEach((group: CalendarData) => {
              groupArray?.push({
                id: group['calendarID'],
                name: group['groupName'],
                color: "",
                journals: group['journals']
              })
            });
            ProfileService.getColors().then(res => {
                groupArray?.forEach((group) => {
                  var index = res.data.findIndex(function(c: { [x: string]: string; }) {
                    return c["calendarID"] === group.id
                  });
                  if (index >= 0) {
                    group.color = res.data[index]["color"]
                  }
                })
                setGroups(groupArray)
                JournalService.getEntries().then(res => {
                  setEntries(res.data)
                  setLoaded(true)
                })
              })
        }).catch(err => {
          if (err.response.status === 403) {
            navigate("/", { state: "Please Login First!" })
          }
        })
    }, [])

    

    return (
        <div>
            <NavBar />
            <Tabs>
                {loaded && groups.map(group => {
                    return (
                        <Tab eventKey={group['id']} title={group['name']} key={group['id']} className="group-tab">
                            <br />
                            <JournalLayout groupID={group['id']} journals={group['journals']} entries={entries[group['id']]} />
                        </Tab>
                    );
                    }
                )}
            </Tabs>
        </div>
    )
}
