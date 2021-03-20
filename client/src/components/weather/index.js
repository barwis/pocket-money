import React from 'react';
import { useDispatch, useSelector } from '../../utils/redux-hooks';

// componenets
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';

// actions
import { fetchWeather, loadWeatherIcon } from './slice';

// utils
import code from '../../utils/countriesList';

// styles
import './style.css';

const Weather = () => {
	const dispatch = useDispatch();

	// const lastFetchStatus = useSelector ( state => state.weather.lastFetchStatus);
	const data = useSelector( state => state.weather.data );
	const weatherIcon = useSelector( state => state.weather.data.current.condition.icon );

	const widgetTitle = `${data.location.name}`;

	React.useEffect( () => {
		dispatch( fetchWeather() );
	}, [] );

	React.useEffect( () => {
		dispatch( loadWeatherIcon( weatherIcon ) );
	}, [ weatherIcon ] );

	return (
		<Widget>
			<WidgetHeader title={widgetTitle} subtitle={data.location && code( data.location.country )} onUpdateClick={() => dispatch( fetchWeather() ) }/>
			<div className="condition">
				<div>
					 <img className="weather-image" src={ data.current.condition.localIcon} alt={data.current.condition.text } />
				</div>
				<div className="temp">
					<div className="temp-real">{( data.current && data.current.temp_c ) || '-'}&deg;</div>
					<div className="temp-feels-like">Feels like {( data.current && data.current.feelslike_c ) || '-'}&deg;</div>
				</div>
			</div>
			<ul className="weather-details">
				<li>
					<div className="icon-wind"> </div>
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
				<li>{data.current && Math.round( data.current.wind_kph )}<sup>km/h</sup></li>
				<li>{data.current && data.current.humidity}<sup>%</sup></li>
				<li>{data.current && data.current.precip_mm}<sup>mm</sup></li>
				<li>{data.current && data.current.pressure_mb}<sup>hPa</sup></li>
			</ul>
		</Widget>
	);
};

export default Weather;
