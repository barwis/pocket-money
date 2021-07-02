import React, { useState } from 'react';
import { useDispatch, useSelector } from '../../utils/redux-hooks';

// componenets
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';

// actions
import { fetchWeather, loadWeatherIcon } from './slice';

// utils
// import code from '../../utils/countriesList';
import { dataUpdate } from '../../utils';

// import './style.scss';
import './style.css';

const DateTimeWeather = () => {
	const dispatch = useDispatch();
	const [ currentDate, setCurrentDate ] = useState( new Date() );
	const [ tick, setTick ] = useState( true );

	const separator = tick ? ':' : '\u00A0';

	const {
		data,
		lastUpdated,
		lastFetchStatus
	} = useSelector( state => state.weather );

	const weatherIcon = useSelector( state => state.weather.data.current.condition.icon );

	const widgetTitle = `${data.location.name}`;

	React.useEffect( () => {
		const timer = setInterval( () => {
			setCurrentDate( new Date() );
			setTick( !tick );
		}, 1000 );
		return () => clearInterval( timer );
	}, [ tick ] );

	React.useEffect( () => {
		return dataUpdate( dispatch, fetchWeather, 600000 );
	}, [ dispatch ] );

	React.useEffect( () => {
		dispatch( loadWeatherIcon( weatherIcon ) );
	}, [ weatherIcon ] );

	const getDate = () => {
		const dow = new Intl.DateTimeFormat( 'en-GB', { weekday: 'long' }).format( currentDate );
		const todaysDate = new Intl.DateTimeFormat( 'en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format( currentDate );

		return `${dow}, ${todaysDate}`;
	};

	return (
		<Widget>
			<WidgetHeader
				title={getDate()}
				lastUpdated={lastUpdated}
				lastFetchStatus={lastFetchStatus}
				onUpdateClick={() => dispatch( fetchCalendarEvents() ) }
			/>
			<div className="today">
				<div className="date-time-conditions">
					<div className="current-time">
						<div>{currentDate.getHours()}</div>
						<div className="separator">{separator}</div>
						<div>{( currentDate.getMinutes() < 10 ? '0' : '' ) + currentDate.getMinutes()}</div>
					</div>
					<div className="conditions">
						<div className="percip">81% / 5mm</div>
						<div className="pressure">1013hPa</div>
						<div className="wind">5km/h</div>
					</div>
				</div>
				<div className="weather">
					<div className="weather__icon">
						{/* icon will go here */}
					</div>
					<div className="weather__details">
						<div className="weather__temp weather__temp--current">{ data.current && data.current.temp_c }°C</div>
						<div className="weather__temp weather__temp--max">{ data.forecast && Math.round( data.forecast.maxtemp_c ) }°C</div>
						<div className="weather__temp weather__temp--min">{ data.forecast && Math.round( data.forecast.mintemp_c ) }°C</div>
					</div>
				</div>
			</div>
		</Widget>
	);
};

export default DateTimeWeather;
