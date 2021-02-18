import React from 'react';
import Header from './components/header';
import RecycleSchedule from './components/recycleSchedule/recycleSchedule';
import './App.css'; 

function App() { 
  return (
    <div className='app'>
      <Header/>
	  <RecycleSchedule/>
    </div>
  );
}

export default App;
