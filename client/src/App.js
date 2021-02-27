import React from 'react';
// import Header from './components/header';
import RecycleSchedule from './components/recycle/recycle';
import Weather from './components/weather';
import DateTime from './components/dateTime';
import Calendar from './components/calendar';
import Forecast from './components/forecast';
import './App.css'; 

// function App() { 
//   return (
const App = () => (
    <div className='app'>
		<DateTime />
		<Weather />
		<Forecast />
		<RecycleSchedule/>
		<Calendar/>
    </div>
);

export default App;
