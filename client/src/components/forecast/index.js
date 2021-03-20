import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// actions to dispatch
import { fetchForecast } from './slice';

// components
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';

// utils

import dataUpdate from '../../utils/dataUpdate';

// styles
import './style.css';

const Forecast = () => {
	const dispatch = useDispatch();
	const { data, lastFetchStatus } = useSelector( state => state.forecast );

	useEffect( () => {
		return dataUpdate( dispatch, fetchForecast, 600000 );
	}, [ dispatch ] );

	return (
		<Widget>
			<WidgetHeader title="Forecast" onUpdateClick={() => dispatch( fetchForecast() ) } lastUpdated={ lastFetchStatus } />
			<div className="forecast-data">
				{data.map( ( item, index ) => {
					return ( <div className="forecast-day" key={index}>
						<span>{item.day}</span>
						<div className="icon"><img src={item.icon} alt={item.day} /></div>
						<span>{item.temp}{!!item.temp && <div>&deg;C</div>}</span>
					</div> );
				})}
			</div>
		</Widget>
	);
};

export default Forecast;
