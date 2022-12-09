import { act, prettyDOM, render, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import '@testing-library/jest-dom'

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('renders login layout', async () => {
    const renderer = await act(async () => render(<Login />))
    const usernameElement = await waitFor(() =>
        renderer.getByText("Username/Email")
    );
    expect(usernameElement).toBeInTheDocument();

    const passwordElement = await waitFor(() =>
        renderer.getByText("Password")
    );
    expect(passwordElement).toBeInTheDocument();
})
