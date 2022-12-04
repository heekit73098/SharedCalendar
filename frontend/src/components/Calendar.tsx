import '../assets/Calendar.css';

import type { ExternalEventTypes, Options } from '@toast-ui/calendar';
import type { ChangeEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import Calendar from '@toast-ui/react-calendar';
import { theme } from '../utils/theme';
import AuthService from "../utils/authService";
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

type ViewType = 'month' | 'week' | 'day';


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
  const calendarRef = useRef<typeof CalendarComponent>(null);
  const [selectedDateRangeText, setSelectedDateRangeText] = useState('');
  const [selectedView, setSelectedView] = useState(view);
  const [events, setEvents] = useState([])
  const navigate = useNavigate()
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

  function refreshList() {
    axios.get("http://localhost:8000/api/calendar", { 
      withCredentials:true, 
      xsrfHeaderName:"X-CSRFTOKEN", 
      xsrfCookieName: "csrftoken" 
    })
    .then((res)=>{
      res.data.forEach((event: { start: Date; end: Date; }) => {
        event.start = new Date(event.start);
        event.end = new Date(event.end);
      });
      setEvents(res.data)
    })
    .catch((err) => {
      const goToLogin = () => navigate('/login')
      goToLogin()
    });
  } 


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
    refreshList();
  }, [])

  const onAfterRenderEvent: ExternalEventTypes['afterRenderEvent'] = (res) => {
    console.group('onAfterRenderEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();
  };

  const onBeforeDeleteEvent: ExternalEventTypes['beforeDeleteEvent'] = (res) => {
    console.group('onBeforeDeleteEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();

    const { id, calendarId } = res;
    axios.delete("http://localhost:8000/api/calendar/"+ id, { 
      withCredentials:true, 
      xsrfHeaderName:"X-CSRFTOKEN", 
      xsrfCookieName: "csrftoken" 
    }).then((res) => refreshList());
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


  const onBeforeUpdateEvent: ExternalEventTypes['beforeUpdateEvent'] = (updateData) => {
    console.group('onBeforeUpdateEvent');
    console.log(updateData);
    console.groupEnd();

    const targetEvent = updateData.event;
    const changes = { ...updateData.changes };
    axios.patch("http://localhost:8000/api/calendar/" + targetEvent.id + "/", changes, { 
      withCredentials:true, 
      xsrfHeaderName:"X-CSRFTOKEN", 
      xsrfCookieName: "csrftoken" 
    }).then((res) => refreshList());
  };

  const onBeforeCreateEvent: ExternalEventTypes['beforeCreateEvent'] = (eventData) => {
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
    };
    axios.post("http://localhost:8000/api/calendar/", event, { 
      withCredentials:true, 
      xsrfHeaderName:"X-CSRFTOKEN", 
      xsrfCookieName: "csrftoken" 
    }).then((res) => refreshList());
  };

  function logout() {
    AuthService.logout();
    navigate("/")
  } 

  return (
    <div>
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
        <span className="render-range">{selectedDateRangeText}</span>
      </div>
      <Calendar
        height="600px"
        calendars={initialCalendars}
        month={{ startDayOfWeek: 1 }}
        events={events}
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
      <div><button onClick={logout}>Logout</button></div>
    </div>
  );
}

export default CalendarComponent;