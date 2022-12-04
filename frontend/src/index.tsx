import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CalendarComponent from './components/Calendar';
import Login from './components/Login';
import Register from './components/Register';
import reportWebVitals from './utils/reportWebVitals';
import '@toast-ui/calendar/toastui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.min.css';
import 'tui-time-picker/dist/tui-time-picker.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// root.render(
//   <React.StrictMode>
//     <App view={'month'} />
//   </React.StrictMode>
// );
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/calendar" element={<CalendarComponent view={'month'} />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
    </Routes>
    </BrowserRouter>
    {/* <Login />
    <Register /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


