import { act, prettyDOM, render, waitFor } from '@testing-library/react';
import Login from '../components/Login';
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
    const renderer = await act(async () => render(<Login />))
    const usernameElement = await waitFor(() =>
        renderer.getByText("Email")
    );
    expect(usernameElement).toBeInTheDocument();

    const passwordElement = await waitFor(() =>
        renderer.getByText("Password")
    );
    expect(passwordElement).toBeInTheDocument();
})
