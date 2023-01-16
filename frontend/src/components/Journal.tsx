import { useEffect, useRef, useState } from "react";
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import ProfileService from '../utils/profileService';
import NavBar from "./NavBar";
import JournalLayout from "./JournalLayout";
import 'react-tabs/style/react-tabs.css';
import JournalService from "../utils/journalService";

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
    const [groups, setGroups] = useState<Group[]>([])
    const [entries, setEntries] = useState<{ [id: string] : {} }>({})
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
              })
        })
        JournalService.getEntries().then(res => {
          setEntries(res.data)
        })
    }, [])

    

    return (
        <div>
            <NavBar />
            <Tabs>
                {groups.map(group => {
                    return (
                        <Tab eventKey={group['id']} title={group['name']} key={group['id']}>
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
