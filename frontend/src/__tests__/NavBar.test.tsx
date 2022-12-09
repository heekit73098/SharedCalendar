import { act, prettyDOM, render, waitFor } from '@testing-library/react';
import NavBar from '../components/NavBar';
import '@testing-library/jest-dom'

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('renders login layout', async () => {
    const renderer = await act(async () => render(<NavBar />))
    const appNameElement = await waitFor(() =>
        renderer.getByText("Futurum")
    );
    expect(appNameElement).toBeInTheDocument();

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