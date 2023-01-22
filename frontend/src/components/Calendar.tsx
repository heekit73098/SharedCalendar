import '../assets/Calendar.css';

import type { ExternalEventTypes, Options } from '@toast-ui/calendar';
import type { ChangeEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import Calendar from '@toast-ui/react-calendar';
import { theme } from '../utils/theme';
import CalendarService from "../utils/calendarService"
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import ProfileService from '../utils/profileService';
import { Alert } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { IoChevronBackCircle, IoChevronForwardCircle, IoToday } from "react-icons/io5";

type ViewType = 'month' | 'week' | 'day';
type CalendarEvent = {
  calendarId: string; 
  id: string; 
  title: string | undefined; 
  isAllday: boolean | undefined; 
  start: Date; 
  end: Date; 
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


const viewModeOptions = [
  {
    title: 'Monthly',
    value: 'month',
  },
  {
    title: 'Weekly',
    value: 'week',
  },
  {
    title: 'Daily',
    value: 'day',
  },
];

function CalendarComponent({ view }: { view: ViewType }) {
  const navigate = useNavigate()
  const calendarRef = useRef<typeof CalendarComponent>(null);
  const [selectedDateRangeText, setSelectedDateRangeText] = useState('');
  const [selectedView, setSelectedView] = useState(view);
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])
  const [calendars, setCalendars] = useState<Options['calendars']>([])
  const [filteredCalendars, setFilteredCalendars] = useState<Options['calendars']>([])
  const [alert, setAlert] = useState(false)
  const [message, setMessage] = useState("")

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const getCalInstance = useCallback(() => calendarRef.current?.getInstance?.(), []);

  const updateRenderRangeText = useCallback(() => {
    const calInstance = getCalInstance();
    if (!calInstance) {
      setSelectedDateRangeText('');
    }

    const viewName = calInstance.getViewName();
    const calDate = calInstance.getDate();
    const rangeStart = calInstance.getDateRangeStart();

    let year = calDate.getFullYear();
    let month = calDate.getMonth();
    let date = calDate.getDate();
    let dateRangeText: string;
    switch (viewName) {
      case 'month': {
        let d = new Date()
        d.setMonth(month)
        d.setFullYear(year)
        dateRangeText = d.toLocaleDateString('en-SG', {
          month: "long",
          year: "numeric"
        })
        break;
      }
      case 'week': {
        let startYear = rangeStart.getFullYear();
        let startMonth = rangeStart.getMonth();
        let startDay = rangeStart.getDate();

        let startDate = new Date()
        startDate.setDate(startDay)
        startDate.setMonth(startMonth)
        startDate.setFullYear(startYear)
        let startDateText = startDate.toLocaleDateString("en-SG", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })

        let endDate = new Date()
        endDate.setDate(startDate.getDate() + 6)
        let endDateText = endDate.toLocaleDateString("en-SG", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
        dateRangeText = `${startDateText} - ${endDateText}`;
        break;
      }
      default:
        let d = new Date()
        d.setMonth(month)
        d.setFullYear(year)
        d.setDate(date)
        dateRangeText = d.toLocaleDateString('en-SG', {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
    }

    setSelectedDateRangeText(dateRangeText);
  }, [getCalInstance]);

  useEffect(() => {
    setSelectedView(view);
  }, [view]);

  useEffect(() => {
    updateRenderRangeText();
  }, [selectedView, updateRenderRangeText]);

  useEffect(() => {
    refreshFilteredEvents(events)
  }, [filteredCalendars, setFilteredCalendars, events, setEvents])

  useEffect(() => {
    ProfileService.getCalendars().then(res => {
      var calendarArray: Options['calendars'] = []
      res.data.forEach((calendar: CalendarData) => {
        calendarArray?.push({
          id: calendar['calendarID'],
          name: calendar['groupName'],
        })
      });
      ProfileService.getColors().then(res => {
        calendarArray?.forEach((calendar) => {
          var index = res.data.findIndex(function(c: { [x: string]: string; }) {
            return c["calendarID"] === calendar.id
          });
          if (index >= 0) {
            calendar.backgroundColor = res.data[index]["color"]
            calendar.borderColor = res.data[index]["color"]
            calendar.dragBackgroundColor = res.data[index]["color"]
          }
        })
        setCalendars(calendarArray)
        setFilteredCalendars(calendarArray)
        refreshEvents()
      }).catch((err) => {
        if (err.response.status === 403) {
          navigate("/", { state: "Please Login First!" })
        } 
      })
    }).catch((err) => {
      if (err.response.status === 403) {
        navigate("/", { state: "Please Login First!" })
      } 
    })
  }, [])

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
    return true
  }


  function refreshEvents() {
    CalendarService.refreshList()
    .then((res)=>{
      let retrievedEvents: CalendarEvent[] = []
      res.data.forEach((event: {
        id: string;
        title: string | undefined;
        isAllday: boolean | undefined;
        category: string;
        dueDateClass: string;
        location: string | undefined;
        state: string | undefined;
        isPrivate: boolean | undefined;
        calendarID: string[];
        attendee: string; 
        start: Date; 
        end: Date; 
        tag: string;
      }) => {
        event.calendarID.forEach(calendarID => {
          const e: CalendarEvent = {
            calendarId: calendarID,
            id: event.id,
            title: calendarID[0] === "B" ? "Busy" : event.title,
            isAllday: event.isAllday,
            start: new Date(event.start),
            end: new Date(event.end),
            category: event.category,
            dueDateClass: event.dueDateClass,
            location: calendarID[0] === "B" ? "Unknown" :event.location,
            state: event.state,
            isPrivate: event.isPrivate,
            tag: event.tag,
            attendees: [event.attendee],
          }
          retrievedEvents.push(e)
        });
      });
      setEvents(retrievedEvents)
    })
    .catch((err) => {
      if (err.response.status === 403) {
        navigate("/", { state: "Please Login First!" })
      }
    });
  }

  function filterCalendars(event: { target: { checked: boolean; value: string; }; }) {
    if (event.target.checked) {
      if (!filteredCalendars?.some(e => e.id === event.target.value)) {
        if (filteredCalendars && calendars?.find(x => x.id === event.target.value)){
          setFilteredCalendars([...filteredCalendars,calendars?.find(x => x.id === event.target.value)!])
        }else{
          setFilteredCalendars([calendars?.find(x => x.id === event.target.value)!])
        }
      }
    } else{
      setFilteredCalendars(filteredCalendars?.filter((calendar) => {
        return calendar.id !== event.target.value;
      }))
    }
  }

  const onAfterRenderEvent: ExternalEventTypes['afterRenderEvent'] = (res) => {
    console.group('onAfterRenderEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();
  };

  const onChangeSelect = (ev: ChangeEvent<HTMLSelectElement>) => {
    setSelectedView(ev.target.value as ViewType);
  };

  const onClickDayName: ExternalEventTypes['clickDayName'] = (res) => {
    console.group('onClickDayName');
    console.log('Date : ', res.date);
    console.groupEnd();
  };

  const onClickNavi = (ev: MouseEvent<HTMLButtonElement>) => {
    if ((ev.target as HTMLButtonElement).tagName === 'BUTTON') {
      const button = ev.target as HTMLButtonElement;
      const actionName = (button.getAttribute('data-action') ?? 'month').replace('move-', '');
      getCalInstance()[actionName]();
      updateRenderRangeText();
    }
  };

  const onClickEvent: ExternalEventTypes['clickEvent'] = (res) => {
    console.group('onClickEvent');
    console.log('MouseEvent : ', res.nativeEvent);
    console.log('Event Info : ', res.event);
    console.groupEnd();
  };

  const onBeforeDeleteEvent: ExternalEventTypes['beforeDeleteEvent'] = (res) => {
    console.group('onBeforeDeleteEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();

    CalendarService.deleteEvent(res.id).then((res) => refreshEvents());
  };


  const onBeforeUpdateEvent: ExternalEventTypes['beforeUpdateEvent'] = (updateData) => {
    console.group('onBeforeUpdateEvent');
    console.log(updateData);
    console.groupEnd();
    if ('start' in updateData.changes){
      updateData.changes.start = updateData.changes.start?.toString()
    }
    if ('end' in updateData.changes){
      updateData.changes.end = updateData.changes.end?.toString()
    }
    if ('isAllday' in updateData.changes){
      updateData.changes.category = updateData.changes.isAllday ? 'allday' : 'time'
    }

    const targetEvent = updateData.event;
    const changes = { ...updateData.changes };

    CalendarService.updateEvent(targetEvent.id, changes).then((res) => refreshEvents());
  };

  const onBeforeCreateEvent: ExternalEventTypes['beforeCreateEvent'] = (eventData) => {
    if (!eventData.calendarId) {
      setMessage("No Calendar Chosen!")
      setAlert(true)
      return
    }
    const event = {
      calendarID: eventData.calendarId || '',
      id: "",
      title: eventData.title,
      isAllday: eventData.isAllday,
      start: eventData.start?.toString(),
      end: eventData.end?.toString(),
      category: eventData.isAllday ? 'allday' : 'time',
      dueDateClass: '',
      location: eventData.location,
      state: eventData.state,
      isPrivate: eventData.isPrivate,
      tag: ''
    };
    CalendarService.createEvent(event).then((res) => refreshEvents());
  }

  return (
    <div>
      <NavBar />
      <Alert show={alert} variant={"danger"} onClose={() => setAlert(false)} dismissible>
          {message}
      </Alert>
      <br />
      <div className="container">
        <span className="render-range">{selectedDateRangeText}</span>
      </div>
      <div>
        <select onChange={onChangeSelect} value={selectedView}>
            {viewModeOptions.map((option, index) => (
              <option value={option.value} key={index}>
                {option.title}
              </option>
            ))}
        </select>
        <span>
          <button
            type="button"
            className="move-today"
            data-action="move-today"
            onClick={onClickNavi}
          >
            <IoToday size={28}/>
          </button>
          <button
            type="button"
            className="move-day"
            data-action="move-prev"
            onClick={onClickNavi}
          >
            <IoChevronBackCircle size={28}/>
          </button>
          <button
            type="button"
            className="move-day"
            data-action="move-next"
            onClick={onClickNavi}
          >
            <IoChevronForwardCircle size={28}/>
          </button>
        </span>
      </div>
      <br />
      <Row>
        <Col sm={1}>
          <h5>Groups:</h5>
          <table>
            <tbody>
              {calendars?.map(item => {
                return (
                    <tr key={item.id}>
                      <td><label className="checkbox-label" htmlFor={item.id}>{item.name}</label></td>
                      <td><input type="checkbox" id={item.id} value={item.id} defaultChecked={true} onChange={filterCalendars} /></td>
                    </tr>
                );
                })}
            </tbody>
          </table>
        </Col>
        <Col>
          <Calendar
            height="750px"
            calendars={filteredCalendars}
            month={{ startDayOfWeek: 0 }}
            events={filteredEvents}
            template={{
              milestone(event) {
                return `<span style="color: #fff; background-color: ${event.backgroundColor};">${event.title}</span>`;
              },
              allday(event) {
                return `[All day] ${event.title}`;
              },
            }}
            theme={theme}
            useDetailPopup={true}
            useFormPopup={true}
            view={selectedView}
            week={{
              eventView: true,
              taskView: false,
            }}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref={calendarRef}
            onAfterRenderEvent={onAfterRenderEvent}
            onBeforeDeleteEvent={onBeforeDeleteEvent}
            onClickDayname={onClickDayName}
            onClickEvent={onClickEvent}
            onBeforeUpdateEvent={onBeforeUpdateEvent}
            onBeforeCreateEvent={onBeforeCreateEvent}
          />
        </Col>
      </Row>
      
      
      
    </div>
  );
}

export default CalendarComponent;