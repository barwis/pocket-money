import React from 'react';
// import Header from './components/header';
import RecycleSchedule from './components/recycleSchedule/recycleSchedule';
import Weather from './components/weather/weather';
import DateTime from './components/dateTime/dateTime';
import Calendar from './components/calendar/calendar';

import './App.css'; 

function App() { 
  return (
    <div className='app'>
		<DateTime />
		<Weather />
		<RecycleSchedule/>
		<Calendar/>
    </div>
  );
}

export default App;
