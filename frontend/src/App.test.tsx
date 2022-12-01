import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom'
import axios from 'axios';
import { act } from 'react-dom/test-utils';


jest.mock('axios');

// Simple Rendering Unit Tests
test("test Render Today Button", async () => {
  await act(async () => {
    render(<App view={'month'} />);
  });
  await waitFor(() => {
    expect(screen.getByText(/today/i)).toBeInTheDocument();
  })
});

test("test Render Prev Button", async () => {
  await act(async () => {
    render(<App view={'month'} />);
  });
  await waitFor(() => {
    expect(screen.getByText(/prev/i)).toBeInTheDocument();
  })
});

test("test Render Next Button", async () => {
  await act(async () => {
    render(<App view={'month'} />);
  });
  await waitFor(() => {
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  })
});