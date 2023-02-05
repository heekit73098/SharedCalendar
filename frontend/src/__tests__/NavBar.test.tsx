import { act, prettyDOM, render, waitFor } from '@testing-library/react';
import NavBar from '../components/NavBar';
import '@testing-library/jest-dom'
import MockAdaptor from 'axios-mock-adapter'
import Constants from '../assets/testResBody';
import axios from 'axios';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('renders login layout', async () => {
    const axiosMock = new MockAdaptor(axios);
    axiosMock.onGet('http://localhost:8000/api/profile/').reply(200, Constants.GET_PROFILE_BODY);
    const renderer = await act(async () => render(<NavBar />))

    const profileElement = await waitFor(() =>
        renderer.getByText("Profile")
    );
    expect(profileElement).toBeInTheDocument();

    const calendarElement = await waitFor(() =>
        renderer.getByText("Calendar")
    );
    expect(calendarElement).toBeInTheDocument();

    const logoutElement = await waitFor(() =>
        renderer.getByText("Logout")
    );
    expect(logoutElement).toBeInTheDocument();
})