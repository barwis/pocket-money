import React from 'react';
import { useDispatch, useSelector } from '../../utils/redux-hooks';

// componenets
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';

// actions
import { fetchWeather, loadWeatherIcon } from './slice';

// utils
import code from '../../utils/countriesList';
import dataUpdate from '../../utils/dataUpdate';

// styles
import './style.css';

const Weather = () => {
	const dispatch = useDispatch();
	const {
		data,
		lastUpdated,
		lastFetchStatus
	} = useSelector( state => state.weather );

	const widgetTitle = `${data.location.name}`;

	const {
		condition,
		temp_c: temp,
		feelslike_c: feelsLike,
		wind_kph: windSpeed,
		humidity,
		precip_mm: precip,
		pressure_mb: pressure
	} = useSelector( state => state.weather.data.current );

	const weatherIcon = condition.icon;

	const imgPath = `/weather/64x64/day/svg/`;

	// helper functions
	const updateWeather = () => dispatch( fetchWeather() );
	const updateWeatherIcon = ( weatherIcon ) => dispatch( loadWeatherIcon( weatherIcon ) );

	React.useEffect( () => {
		return dataUpdate( dispatch, fetchWeather, 600000 );
	}, [ dispatch ] );

	React.useEffect( () => {
		updateWeatherIcon( weatherIcon );
	}, [ weatherIcon ] );

	return (
		<Widget className="weather">
			<WidgetHeader
				title={widgetTitle}
				subtitle={data.location && code( data.location.country )}
				onUpdateClick={updateWeather}
				lastUpdated={lastUpdated}
				lastFetchStatus={lastFetchStatus}
			/>
			<div className="condition">
				<div>
					 <img className="weather-image" src={ condition.icon && imgPath + '116.svg'} alt={ condition.text } />
					 {/* <img className="weather-image" src={ condition.icon && imgPath + condition.icon + '.svg'} alt={ condition.text } /> */}
				</div>
				<div className="temp">
					<div className="temp-real">{ data.current && temp }&deg;</div>
					<div className="temp-feels-like">Feels like {( data.current && feelsLike ) || '-'}&deg;</div>
				</div>
			</div>
			<ul className="weather-details">
				<li>
					<div className="icon-wind"></div>
				</li>
				<li>
					<div className="icon-raindrop"></div>
				</li>
				<li>
					<div className="icon-raindrops"></div>
				</li>
				<li>
					<div className="icon-cloud-download"></div>
				</li>
				<li>{data.current && Math.round( windSpeed )}<sup>km/h</sup></li>
				<li>{data.current && humidity}<sup>%</sup></li>
				<li>{data.current && precip}<sup>mm</sup></li>
				<li>{data.current && pressure}<sup>hPa</sup></li>
			</ul>
		</Widget>
	);
};

export default Weather;
