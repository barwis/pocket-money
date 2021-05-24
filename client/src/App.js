import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

import DateTime from './components/dateTime';
import Calendar from './components/calendar';
import Forecast from './components/forecast';
import Weather from './components/weather';
import Recycle from './components/recycle';
import DateTimeWeather from './components/dateTimeWeather';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Homepage = () =>
	<>
		<DateTime/>
		<Weather />
		<Forecast/>
		<Recycle />
		<Calendar/>
	</>;

const App = () => (
	<div className="app">
		<Switch>
			<Route path="/" component={Homepage} exact />
		</Switch>

	</div>
);

export default hot( module )( App );
