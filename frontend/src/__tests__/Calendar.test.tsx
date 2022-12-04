import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CalendarComponent from '../components/Calendar';
import '@testing-library/jest-dom'
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


jest.mock('axios');

// Simple Rendering Unit Tests
test("test Render Today Button", async () => {
  await act(async () => {
    render(<BrowserRouter><Routes><Route element={<CalendarComponent view={'month'} />}/></Routes></BrowserRouter>);
  });
  await waitFor(() => {
    expect(screen.getByText(/today/i)).toBeInTheDocument();
  })
});

test("test Render Prev Button", async () => {
  await act(async () => {
    render(<BrowserRouter><CalendarComponent view={'month'} /></BrowserRouter>);
  });
  await waitFor(() => {
    expect(screen.getByText(/prev/i)).toBeInTheDocument();
  })
});

test("test Render Next Button", async () => {
  await act(async () => {
    render(<BrowserRouter><CalendarComponent view={'month'} /></BrowserRouter>);
  });
  await waitFor(() => {
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  })
});