import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import find from 'lodash/find';

import React, {useEffect, useState} from 'react';
import {Alert, Button, Modal, Pressable, StyleSheet, Text} from 'react-native';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils
} from 'react-native-calendars';
import CalendarService from '../utils/calendarService';
import ProfileService from '../utils/profileService';
import { useAuthState } from '../utils/authContext';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { View } from './Themed';
import Event from './Event';

const EVENT_COLOR = '#e6add8';
const today = new Date();
const getDate = (offset = 0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

const timelineEvents: TimelineEventProps[] = [
  {
    start: `${getDate(-1)} 09:20:00`,
    end: `${getDate(-1)} 12:00:00`,
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  },
  {
    start: `${getDate()} 01:15:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Meeting A',
    summary: 'Summary for meeting A',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 01:30:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Meeting B',
    summary: 'Summary for meeting B',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 01:45:00`,
    end: `${getDate()} 02:45:00`,
    title: 'Meeting C',
    summary: 'Summary for meeting C',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 02:40:00`,
    end: `${getDate()} 03:10:00`,
    title: 'Meeting D',
    summary: 'Summary for meeting D',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 02:50:00`,
    end: `${getDate()} 03:20:00`,
    title: 'Meeting E',
    summary: 'Summary for meeting E',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 04:30:00`,
    end: `${getDate()} 05:30:00`,
    title: 'Meeting F',
    summary: 'Summary for meeting F',
    color: EVENT_COLOR
  },
  {
    start: `${getDate(1)} 00:30:00`,
    end: `${getDate(1)} 01:30:00`,
    title: 'Visit Grand Mother',
    summary: 'Visit Grand Mother and bring some fruits.',
    color: 'lightblue'
  },
  {
    start: `${getDate(1)} 02:30:00`,
    end: `${getDate(1)} 03:20:00`,
    title: 'Meeting with Prof. Behjet Zuhaira',
    summary: 'Meeting with Prof. Behjet at 130 in her office.',
    color: EVENT_COLOR
  },
  {
    start: `${getDate(1)} 04:10:00`,
    end: `${getDate(1)} 04:40:00`,
    title: 'Tea Time with Dr. Hasan',
    summary: 'Tea Time with Dr. Hasan, Talk about Project'
  },
  {
    start: `${getDate(1)} 01:05:00`,
    end: `${getDate(1)} 01:35:00`,
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: `${getDate(1)} 14:30:00`,
    end: `${getDate(1)} 16:30:00`,
    title: 'Meeting Some Friends in ARMED',
    summary: 'Arsalan, Hasnaat, Talha, Waleed, Bilal',
    color: 'pink'
  },
  {
    start: `${getDate(2)} 01:40:00`,
    end: `${getDate(2)} 02:25:00`,
    title: 'Meet Sir Khurram Iqbal',
    summary: 'Computer Science Dept. Comsats Islamabad',
    color: 'orange'
  },
  {
    start: `${getDate(2)} 04:10:00`,
    end: `${getDate(2)} 04:40:00`,
    title: 'Tea Time with Colleagues',
    summary: 'WeRplay'
  },
  {
    start: `${getDate(2)} 00:45:00`,
    end: `${getDate(2)} 01:45:00`,
    title: 'Lets Play Apex Legends',
    summary: 'with Boys at Work'
  },
  {
    start: `${getDate(2)} 11:30:00`,
    end: `${getDate(2)} 12:30:00`,
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: `${getDate(4)} 12:10:00`,
    end: `${getDate(4)} 13:45:00`,
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  }
];

type CalendarConfig = {
  id: string,
  name: string,
  color: string
}

type CalendarEvent = {
  calendarId: string; 
  id: string; 
  title: string; 
  isAllday: boolean | undefined; 
  start: string; 
  end: string; 
  category: string; 
  dueDateClass: string; 
  location: string | undefined; 
  state: string | undefined; 
  isPrivate: boolean | undefined; 
  tag: string;
  attendees: string[];
}

type CalendarData = {
  'calendarID': string,
  'groupName': string,
  'isPersonal': boolean,
  'isAnonymous': boolean,
  'journals': string[][]
}

const INITIAL_TIME = {hour: 9, minutes: 0};
const EVENTS: TimelineEventProps[] = timelineEvents;


export default function TimelineCalendarScreen() {
  const router = useRouter()
  const [currentDate, setDate] = useState(getDate())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])
  const [eventsByDate, setEventsByDate] = useState({})
  const [token, setToken] = useState("")
  const [calendars, setCalendars] = useState<CalendarConfig[]>([])
  const [filteredCalendars, setFilteredCalendars] = useState<CalendarConfig[]>([])
  const { state } = useAuthState()
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>()

  useEffect(() => {
    console.log(token)
    if (token === ""){
      setToken(state.token!)
      return
    }
    refreshEvents()
    // console.log(eventsByDate)
  }, [isFocused])

  useEffect(() => {
    if (state.state !== "LOGGED_IN") {
      router.replace("index")
    }
    setToken(state.token!)
    
  }, [])

  useEffect(() => {
    refreshFilteredEvents(events)
  }, [filteredCalendars, setFilteredCalendars, events, setEvents])

  useEffect(
    () => {
      console.log(token)
      if (token === ""){
        setToken(state.token!)
        return
      }
      ProfileService.getCalendars(token).then(res => {
        var calendarArray: CalendarConfig[] = []
        res.data.forEach((calendar: CalendarData) => {
          calendarArray?.push({
            id: calendar['calendarID'],
            name: calendar['groupName'],
            color: ""
          })
        });
        ProfileService.getColors(token).then(res => {
          calendarArray?.forEach((calendar) => {
            var index = res.data.findIndex(function(c: { [x: string]: string; }) {
              return c["calendarID"] === calendar.id
            });
            if (index >= 0) {
              calendar.color = res.data[index]["color"]
            }
          })
          setCalendars(calendarArray)
          setFilteredCalendars(calendarArray)
          refreshEvents()
      }).catch(
        (err) => {
          console.log("Get Colors Error")
          console.log(err)
        }
      )
    }).catch(
      (err) => {
        console.log("Get Calendars Error")
        console.log(err)
      }
    )
    }
  , [token, setToken])

  function refreshFilteredEvents(array: CalendarEvent[]): boolean {
    if (!(events.length && filteredCalendars?.length)) {
      setFilteredEvents([])
      return false
    }
    array.sort(function (a, b) {
      return a.calendarId.charCodeAt(0) - b.calendarId.charCodeAt(0);
    });
    array = array.filter((event: { calendarId: string; }) => {
      return (filteredCalendars!.map(a => a.id).includes(event.calendarId));
    })
    const filteredData = array.filter((value: { tag: any; }, index: any, self: any[]) => 
      self.findIndex(v => v.tag === value.tag) === index
    );
    setFilteredEvents(filteredData)
    setEventsByDate(groupBy(filteredData, e => CalendarUtils.getCalendarDateString(e.start)) as {
        [key: string]: CalendarEvent[];
    })
    return true
  }

  function showEvent(event: any) {
    console.log(event)
    setSelectedEvent(event)
    setModalVisible(true)
  }

  function refreshEvents() {
    CalendarService.refreshList(token).then(
      (res) => {
        let tempEvents: CalendarEvent[] = []
        res.data.forEach((event: {
          id: string;
          title: string;
          isAllday: boolean | undefined;
          category: string;
          dueDateClass: string;
          location: string | undefined;
          state: string | undefined;
          isPrivate: boolean | undefined;
          calendarID: string[];
          attendee: string;
          start: string; 
          end: string; 
          tag: string;
        }) => {
          event.calendarID.forEach(calendarID => {
            const e: CalendarEvent = {
              calendarId: calendarID,
              id: event.id,
              title: calendarID[0] === "B" ? "Busy" : event.title,
              isAllday: event.isAllday,
              start: event.start,
              end: event.end,
              category: event.category,
              dueDateClass: event.dueDateClass,
              location: calendarID[0] === "B" ? "Unknown" :event.location,
              state: event.state,
              isPrivate: event.isPrivate,
              tag: event.tag,
              attendees: [event.attendee],
            }
            tempEvents.push(e)
          });
        })
        setEvents(tempEvents)
      }
    ).catch(
      (err) => {
        console.log("Get Events Error")
        console.log(err)
      }
    )
  }

  const marked = {
      [`${getDate(-1)}`]: {marked: true},
      [`${getDate()}`]: {marked: true},
      [`${getDate(1)}`]: {marked: true},
      [`${getDate(2)}`]: {marked: true},
      [`${getDate(4)}`]: {marked: true}
  };

  function onDateChanged(date: string){
      setDate(date)
  };

  function onMonthChange(month: any, updateSource: any){
      console.log('TimelineCalendarScreen onMonthChange: ', month, updateSource);
  };

  const timelineProps: Partial<TimelineProps> = {
      format24h: true,
      // onBackgroundLongPress: createNewEvent,
      // onBackgroundLongPressOut: approveNewEvent,
      // scrollToFirst: true,
      // start: 0,
      // end: 24,
      overlapEventsSpacing: 8,
      rightEdgeSpacing: 24,
      onEventPress:showEvent
  };

  return (
    <>
      <CalendarProvider
          date={currentDate}
          onDateChanged={onDateChanged}
          onMonthChange={onMonthChange}
          showTodayButton
          disabledOpacity={0.6}
          // numberOfDays={3}
      >
          <ExpandableCalendar
              firstDay={1}
              //   leftArrowImageSource={require('../img/previous.png')}
              //   rightArrowImageSource={require('../img/next.png')}
              markedDates={marked}
          />
          <TimelineList
              events={eventsByDate}
              timelineProps={timelineProps}
              showNowIndicator
              // scrollToNow
              scrollToFirst
              initialTime={INITIAL_TIME}
          />
      </CalendarProvider>
      {modalVisible && selectedEvent && <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Event selectedEvent={selectedEvent} />
                        <Button
                          title="HideModal"
                          onPress={() => setModalVisible(false)} />
                    </View>
                </View>
          </Modal>
        </View>}
    </>   
  );
  
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});