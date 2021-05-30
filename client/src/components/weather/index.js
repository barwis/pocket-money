import React from 'react';
import { useDispatch, useSelector } from '../../utils/redux-hooks';

// componenets
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';

// actions
import { fetchWeather, logIconUsage } from './slice';

// utils
import code from '../../utils/countriesList';
import { dataUpdate } from '../../utils';

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
		feelslike_c: feelslike,
		wind_kph: windSpeed,
		humidity,
		precip_mm: precip,
		pressure_mb: pressure
	} = useSelector( state => state.weather.data.current );

	const weatherIcon = condition?.icon;
	const weatherText = condition?.text;

	const imgPath = `/weather/64x64/day/svg/`;

	// helper functions
	const updateWeather = () => dispatch( fetchWeather() );

	React.useEffect( () => {
		return dataUpdate( dispatch, fetchWeather, 600000 );
	}, [ dispatch ] );

	React.useEffect( () => {
		dispatch( logIconUsage( weatherIcon ) );
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
					<a href="/iconsList"><img className="weather-image" src={ weatherIcon && imgPath + `${weatherIcon}.svg`} alt={ weatherText} /></a>
				</div>
				<div className="temp">
					<div className="temp-real">{ data.current && temp }&deg;</div>
					<div className="temp-feels-divke">Feels like {( data.current && feelslike ) || '-'}&deg;</div>
				</div>
			</div>
			<div className="weather-details">
				<div>
					<div className="icon-wind"></div>
					<div>{data.current && Math.round( windSpeed )}<sup>km/h</sup></div>
				</div>
				<div>
					<div className="icon-raindrop"></div>
					<div>{data.current && humidity}<sup>%</sup></div>

				</div>
				<div>

					<div className="icon-raindrops"></div>
					<div>{data.current && precip}<sup>mm</sup></div>

				</div>
				<div>
					<div className="icon-cloud-download"></div>
					<div>{data.current && pressure}<sup>hPa</sup></div>

				</div>
				<div></div>
			</div>
		</Widget>
	);
};

export default Weather;
