import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

// import DateTime from './components/dateTime';
// import Calendar from './components/calendar';
// import Forecast from './components/forecast';
// import Weather from './components/weather';
// import Recycle from './components/recycle';
// import DateTimeWeather from './components/dateTimeWeather';
// import IconsList from './components/iconsList';

import Homepage from './pages/home';

import { Route, Switch } from 'react-router-dom';

const Icons = () =>
	<>
		<IconsList/>
	</>;

// const Homepage = () =>
// 	<div className="app">

// 		<DateTime/>
// 		<Weather />
// 		<Forecast/>
// 		<Recycle />
// 		<Calendar/>
// 	</div>;

const App = () => (
	<>
		<Switch>
			<Route path="/" component={Homepage} exact />
			<Route path="/iconsList" component={Icons} exact />
		</Switch>

	</>
);

export default hot( module )( App );
