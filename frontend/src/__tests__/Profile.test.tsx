import { act, prettyDOM, render, waitFor } from '@testing-library/react';
import Profile from '../components/Profile';
import '@testing-library/jest-dom'
import axios from 'axios';
import MockAdaptor from 'axios-mock-adapter'
import Constants from '../assets/testResBody';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('renders base layout of profile', async () => {
  // Use the axios-mock-adapter library to mock the API call to the Django backend
  const axiosMock = new MockAdaptor(axios);
  axiosMock.onGet('http://localhost:8000/api/profile/').reply(200, Constants.GET_PROFILE_BODY);
  axiosMock.onGet('http://localhost:8000/api/color/').reply(200, Constants.GET_COLOR_BODY);
  axiosMock.onGet('http://localhost:8000/api/calendarConfig/').reply(200, Constants.GET_CALENDAR_BODY);

  const renderer = await act(async () => render(<Profile />))
  const submitElement = await waitFor(() =>
    renderer.getByText("Submit")
  );
  expect(submitElement).toBeInTheDocument();
  const emailElement = await waitFor(() =>
    renderer.getByText("Email:")
  );
  expect(emailElement).toBeInTheDocument();
  const nameElement = await waitFor(() =>
    renderer.getByText("Name:")
  );
  expect(nameElement).toBeInTheDocument();
  const changesElement = await waitFor(() =>
    renderer.getByText("Change")
  );
  expect(changesElement).toBeInTheDocument();
  const cfmChangesElement = await waitFor(() =>
    renderer.getByText("Confirm Changes")
  );
  expect(cfmChangesElement).toBeInTheDocument();
});

test('renders retrieval profile detail', async () => {
  // Use the axios-mock-adapter library to mock the API call to the Django backend
  const axiosMock = new MockAdaptor(axios);
  axiosMock.onGet('http://localhost:8000/api/profile/').reply(200, Constants.GET_PROFILE_BODY);
  axiosMock.onGet('http://localhost:8000/api/color/').reply(200, Constants.GET_COLOR_BODY);
  axiosMock.onGet('http://localhost:8000/api/calendarConfig/').reply(200, Constants.GET_CALENDAR_BODY);

  const renderer = await act(async () => render(<Profile />))
  const emailElement = await waitFor(() =>
    renderer.getByText("test@test.com")
  );
  expect(emailElement).toBeInTheDocument();
  const nameElement = await waitFor(() =>
    renderer.getByText("John Tan")
  );
  expect(nameElement).toBeInTheDocument();
  const changesElement = await waitFor(() =>
    renderer.getByText("Personal")
  );
  expect(changesElement).toBeInTheDocument();
  const cfmChangesElement = await waitFor(() =>
    renderer.getByText("TestCal")
  );
  expect(cfmChangesElement).toBeInTheDocument();
});