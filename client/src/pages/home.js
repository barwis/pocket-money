import React from 'react';

import DateTime from '../components/dateTime';
import Calendar from '../components/calendar';
import Forecast from '../components/forecast';
import Weather from '../components/weather';
import Recycle from '../components/recycle';
import DateTimeWeather from '../components/dateTimeWeather';
import IconsList from '../components/iconsList';

import './style.css';

const Settings = () => <a className="settings"><img src="/icons/cog.svg"/></a>;

const Homepage = () =>
	<div className="app">
		<Settings/>
		<DateTime/>
		<Weather />
		<Forecast/>
		<Recycle />
		<Calendar/>
	</div>;

export default Homepage;
