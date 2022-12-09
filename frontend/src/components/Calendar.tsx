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

type ViewType = 'month' | 'week' | 'day';
type CalendarEvent = {
  calendarId: string; 
  id: string; 
  title: string | undefined; 
  isAllday: boolean | undefined; 
  start: string | undefined; 
  end: string | undefined; 
  category: string; 
  dueDateClass: string; 
  location: string | undefined; 
  state: string | undefined; 
  isPrivate: boolean | undefined; 
  tag:string
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
  const [events, setEvents] = useState<never[]>([])
  const [filteredEvents, setFilteredEvents] = useState<never[]>([])
  const [calendars, setCalendars] = useState<Options['calendars']>([])
  const [filteredCalendars, setFilteredCalendars] = useState<Options['calendars']>([])
  const [applyToAll, setApplyToAll] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const initialCalendars: Options['calendars'] = [
    {
      id: '0',
      name: 'Private',
      backgroundColor: '#9e5fff',
      borderColor: '#9e5fff',
      dragBackgroundColor: '#9e5fff',
    },
    {
      id: '1',
      name: 'Company',
      backgroundColor: '#00a9ff',
      borderColor: '#00a9ff',
      dragBackgroundColor: '#00a9ff',
    },
  ];


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
    const rangeEnd = calInstance.getDateRangeEnd();

    let year = calDate.getFullYear();
    let month = calDate.getMonth() + 1;
    let date = calDate.getDate();
    let dateRangeText: string;

    switch (viewName) {
      case 'month': {
        dateRangeText = `${month}/${year}`;
        break;
      }
      case 'week': {
        year = rangeStart.getFullYear();
        month = rangeStart.getMonth() + 1;
        date = rangeStart.getDate();
        const endMonth = rangeEnd.getMonth() + 1;
        const endDate = rangeEnd.getDate();

        const start = `${date < 10 ? '0' : ''}${date}/${month < 10 ? '0' : ''}${month}/${year}`;
        const end = `${endDate < 10 ? '0' : ''}${endDate}/${endMonth < 10 ? '0' : ''}${endMonth}/${year}`;
        dateRangeText = `${start} - ${end}`;
        break;
      }
      default:
        dateRangeText = `${date}/${month}/${year}`;
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
    if (refreshFilteredEvents(events)){
      setLoaded(true)
    }
    
  }, [filteredCalendars, setFilteredCalendars, events, setEvents])

  useEffect(() => {
    ProfileService.getCalendars().then(res => {
      var calendarArray: Options['calendars'] = []
      res.data.forEach((calendar: string[]) => {
        calendarArray?.push({
          id: calendar[0],
          name: calendar[1]
        })
      });
      ProfileService.getColors().then(res => {
        
        calendarArray?.forEach((calendar) => {
          var index = res.data.findIndex(function(c: { [x: string]: string; }) {
            return c["calendarID"] === calendar.id
          });
          calendar.backgroundColor = res.data[index]["color"]
          calendar.borderColor = res.data[index]["color"]
          calendar.dragBackgroundColor = res.data[index]["color"]
        })
        setCalendars(calendarArray)
        setFilteredCalendars(calendarArray)
        refreshEvents()
      }).catch((err) => {
        console.log(err.response.status)
        if (err.response.status == 403) {
          navigate("/login")
        } else {
          console.log(err)
      }
      })
    }).catch((err) => {
      console.log(err.response.status)
      if (err.response.status == 403) {
        navigate("/login")
      } else {
        console.log(err)
    }
    })
  }, [])

  function refreshFilteredEvents(array: never[]): boolean {
    if (!(events.length && filteredCalendars?.length)) {
      setFilteredEvents([])
      return false
    }
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
      res.data.forEach((event: {
        attendees: string[];
        owner: string; 
        start: Date; 
        end: Date; 
        tag: string;
      }) => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
          event.attendees = [event.owner]
      });
      setEvents(res.data)
    })
    .catch((err) => {
      console.log(err.response.status)
      if (err.response.status == 403) {
        navigate("/login")
      } else {
        console.log(err)
      }
    });
  }

  function handleChecked() {
    setApplyToAll(!applyToAll)
  }

  function filterCalendars(event: { target: { checked: boolean; value: string; }; }) {
    if (event.target.checked) {
      if (!filteredCalendars?.some(e => e.id == event.target.value)) {
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

    var index = events.findIndex(function(event) {
      return event["id"] === res.id
    });
    var tag = events[index]["tag"]
    CalendarService.deleteEvent(tag).then((res) => refreshEvents());
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
    var index = events.findIndex(function(event) {
      return event["id"] === targetEvent.id
    });
    var tag = events[index]["tag"]
    CalendarService.updateEvent(tag, changes).then((res) => refreshEvents());
  };

  const onBeforeCreateEvent: ExternalEventTypes['beforeCreateEvent'] = (eventData) => {
    if (applyToAll) {
      var events: CalendarEvent[] = []
      calendars?.forEach(calendar => {
        events.push({
          calendarId: calendar.id || '',
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
        })
      });
      CalendarService.createEvents(events).then((res) => refreshEvents());
    } else {
      const event = {
        calendarId: eventData.calendarId || '',
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
    
  };

  return (
    <div>
      <NavBar />
      <h1>Calendar</h1>
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
            className="btn btn-default btn-sm move-today"
            data-action="move-today"
            onClick={onClickNavi}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            data-action="move-prev"
            onClick={onClickNavi}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            data-action="move-next"
            onClick={onClickNavi}
          >
            Next
          </button>
        </span>
        <span>
          <label>
            Add to all Calendars? <input type="checkbox" checked={applyToAll} onChange={handleChecked}/>
          </label>
        </span>
        <br></br>
        <span className="render-range">{selectedDateRangeText}</span>
      </div>
      <table>
        <tbody>
          {calendars?.map(item => {
                      return (
                          <tr><td><label key={item.id}>{item.name}</label></td><td><input key={item.id} type="checkbox" id={item.id} value={item.id} defaultChecked={true} onChange={filterCalendars} /></td></tr>
                      );
                      })}
        </tbody>
      </table>
      
      <Calendar
        height="600px"
        calendars={filteredCalendars}
        month={{ startDayOfWeek: 1 }}
        events={filteredEvents}
        // template={{
        //   milestone(event) {
        //     return `<span style="color: #fff; background-color: ${event.backgroundColor};">${event.title}</span>`;
        //   },
        //   allday(event) {
        //     return `[All day] ${event.title}`;
        //   },
        // }}
        theme={theme}
        useDetailPopup={true}
        useFormPopup={true}
        view={selectedView}
        week={{
          eventView: true,
          taskView: true,
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
    </div>
  );
}

export default CalendarComponent;