import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CalendarComponent from './components/Calendar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Journal from './components/Journal';
import Features from './components/Features';
import reportWebVitals from './utils/reportWebVitals';
import '@toast-ui/calendar/toastui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.min.css';
import 'tui-time-picker/dist/tui-time-picker.min.css';
import 'bootstrap/dist/css/bootstrap-yeti.min.css';
import Home from './components/Home';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);



root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/calendar" element={<CalendarComponent view={'month'} />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/journal" element={<Journal />}/>
          <Route path="/features" element={<Features />}/>
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


