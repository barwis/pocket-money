import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// actions to dispatch
import { fetchForecast } from './slice';

// components
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';

// utils
import { dataUpdate } from '../../utils';

// styles
import './style.css';

const Forecast = () => {
	const dispatch = useDispatch();

	const imgPath = `/weather/64x64/day/svg/`;

	const getImgUrl = ( imgFileName ) => {
		return `${imgPath}${imgFileName}.svg`;
	};

	const {
		data
		// lastUpdated,
		// lastFetchStatus
	} = useSelector( state => state.forecast );

	useEffect( () => {
		return dataUpdate( dispatch, fetchForecast, 600000 );
	}, [ dispatch ] );

	return (
		<Widget className="forecast">
			<div className="forecast-data" onClick={() => dispatch( fetchForecast() ) }>
				{data.map( ( item, index ) => {
					let newIcon;
					if ( item.externalData ) {
						// console.log( 'exter', item.externalData.icon.filter( Boolean )[0] );
						newIcon = item.externalData.icon.filter( Boolean )[0];
					}
					return ( <div className="forecast-day" key={index}>
						<span>{item.day}</span>
						{/* <div className="icon"><img src={item.icon && getImgUrl( newIcon )} alt={item.code} /></div> */}
						<div className="icon"><img src={item.icon } alt={item.day} /></div>
						<span>{item.temp}{!!item.temp && <div>&deg;C</div>}</span>
					</div> );
				})}
			</div>
		</Widget>
	);
};

export default Forecast;
