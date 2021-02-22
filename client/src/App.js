import React from 'react';
// import Header from './components/header';
import RecycleSchedule from './components/recycleSchedule/recycleSchedule';
import Weather from './components/weather/weather';
import DateTime from './components/dateTime/dateTime';
import Widget from './containers/widget';

import './App.css'; 

function App() { 
  return (
    <div className='app'>
		<RecycleSchedule/>
		<Weather />
		<DateTime />
		<Widget title="jasia" >
			<strong>somethgng bold</strong>
		</Widget>
    </div>
  );
}

export default App;
