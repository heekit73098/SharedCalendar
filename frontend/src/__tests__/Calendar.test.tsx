import { act, prettyDOM, render, waitFor } from '@testing-library/react';
import CalendarComponent from '../components/Calendar';
import '@testing-library/jest-dom'
import axios from 'axios';
import MockAdaptor from 'axios-mock-adapter'
import Constants from '../assets/testResBody';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('renders base layout of calendars', async () => {
  // Use the axios-mock-adapter library to mock the API call to the Django backend
  const axiosMock = new MockAdaptor(axios);
  axiosMock.onGet('http://localhost:8000/api/calendar/').reply(200, Constants.GET_EVENTS_BODY);
  axiosMock.onGet('http://localhost:8000/api/color/').reply(200, Constants.GET_COLOR_BODY);
  axiosMock.onGet('http://localhost:8000/api/calendarConfig/').reply(200, Constants.GET_CALENDAR_BODY);
  axiosMock.onGet('http://localhost:8000/api/profile/').reply(200, Constants.GET_PROFILE_BODY);

  const renderer = await act(async () => render(<CalendarComponent view={'month'} />))
  const prevElement = await waitFor(() =>
    renderer.getByText("Prev")
  );
  expect(prevElement).toBeInTheDocument();
  const nextElement = await waitFor(() =>
    renderer.getByText("Next")
  );
  expect(nextElement).toBeInTheDocument();
  const todayElement = await waitFor(() =>
    renderer.getByText("Today")
  );
  expect(todayElement).toBeInTheDocument();
});

test('renders test calendars', async () => {
  // Use the axios-mock-adapter library to mock the API call to the Django backend
  const axiosMock = new MockAdaptor(axios);
  axiosMock.onGet('http://localhost:8000/api/calendar/').reply(200, Constants.GET_EVENTS_BODY);
  axiosMock.onGet('http://localhost:8000/api/color/').reply(200, Constants.GET_COLOR_BODY);
  axiosMock.onGet('http://localhost:8000/api/calendarConfig/').reply(200, Constants.GET_CALENDAR_BODY);
  axiosMock.onGet('http://localhost:8000/api/profile/').reply(200, Constants.GET_PROFILE_BODY);

  const renderer = await act(async () => render(<CalendarComponent view={'month'} />))
  const calendarElement_one = await waitFor(() =>
    renderer.getByText("Personal")
  );
  expect(calendarElement_one).toBeInTheDocument();
  const calendarElement_two = await waitFor(() =>
    renderer.getByText("TestCal")
  );
  expect(calendarElement_two).toBeInTheDocument();
});