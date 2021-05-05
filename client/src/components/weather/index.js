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

	const weatherIcon = useSelector( state => state.weather.data.current.condition.icon );

	const widgetTitle = `${data.location.name}`;

	React.useEffect( () => {
		return dataUpdate( dispatch, fetchWeather, 600000 );
	}, [ dispatch ] );

	React.useEffect( () => {
		dispatch( loadWeatherIcon( weatherIcon ) );
	}, [ weatherIcon ] );

	const img_path = `http://${LOCAL_IP}/~pi/day/`;

	return (
		<Widget className="weather">
			<WidgetHeader
				title={widgetTitle}
				subtitle={data.location && code( data.location.country )}
				onUpdateClick={() => dispatch( fetchWeather() ) }
				lastUpdated={lastUpdated}
				lastFetchStatus={lastFetchStatus}
			/>
			<div className="condition">
				<div>
					 {/* <img className="weather-image" src={ data.current.condition.localIcon} alt={data.current.condition.text } /> */}
					 <img className="weather-image" src={ img_path + data.current.condition.icon + '.png'} alt={data.current.condition.text } />
				</div>
				<div className="temp">
					<div className="temp-real">{ data.current && data.current.temp_c }&deg;</div>
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
