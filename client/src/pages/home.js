import React from 'react';

import DateTime from '../components/dateTime';
import Calendar from '../components/calendar';
import Forecast from '../components/forecast';
import Weather from '../components/weather';
import Recycle from '../components/recycle';
import DateTimeWeather from '../components/dateTimeWeather';
import IconsList from '../components/iconsList';
import { Cog, Settings } from '../components/settings';
import { useSelector } from '../utils/redux-hooks';

// const { components } = useSelector( state => state.settings );

const Homepage = () => {
	const { settingsOpen, components } = useSelector( state => state.settings );
	// components: {
	// 	dateTime: true,
	// 	weather: true,
	// 	forecast: true,
	// 	recycle: true,
	// 	calendar: true
	// }
	return (
		<div className="app">
			{components.dateTime.isVisible && <DateTime/>}
			{components.weather.isVisible && <Weather />}
			{components.forecast.isVisible && <Forecast/>}
			{components.recycle.isVisible && <Recycle />}
			{components.calendar.isVisible && <Calendar/>}

			{settingsOpen && <Settings/>}
			<Cog/>
		</div>
	);
};

export default Homepage;
