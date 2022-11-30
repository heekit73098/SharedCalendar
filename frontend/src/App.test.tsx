import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom'
import axios from 'axios';

jest.mock('axios');

// Simple Rendering Unit Tests
test("test Render Today Button", () => {
  render(<App view={'month'} />);
  const linkElement = screen.getByText(/today/i);
  expect(linkElement).toBeInTheDocument();
});

test("test Render Prev Button", () => {
  render(<App view={'month'} />);
  const linkElement = screen.getByText(/prev/i);
  expect(linkElement).toBeInTheDocument();
});

test("test Render Next Button", () => {
  render(<App view={'month'} />);
  const linkElement = screen.getByText(/next/i);
  expect(linkElement).toBeInTheDocument();
});