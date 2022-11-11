import './Calendar.css';
import Calendar from 'react-calendar';
import React, { useState } from 'react';

function App() {
  const [value, onChange] = useState(new Date());
  return (
    <body>
      <div className="App">
        <Calendar onChange={onChange} value={value} onClickDay={console.log(value)} />
      </div>
      <div>
        {value.toDateString()}
      </div>
    </body>
  );
}

export default App;
