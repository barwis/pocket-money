import React, { useState, useEffect } from 'react';
import Widget from '../_common/widget';

import './style.css';

const DateTime = () => {
	const [ currentDate, setCurrentDate ] = useState( new Date() );
	const [ tick, setTick ] = useState( true );

	const separator = tick ? ':' : '\u00A0';
	useEffect( () => {
		const timer = setInterval( () => {
			setCurrentDate( new Date() );
			setTick( !tick );
		}, 1000 );
		return () => clearInterval( timer );
	}, [ tick ] );

	return (

		<Widget className="dateTime">
			<div className="time">
				<div>{currentDate.getHours()}</div>
				<div className="separator">{separator}</div>
				<div>{( currentDate.getMinutes() < 10 ? '0' : '' ) + currentDate.getMinutes()}</div>
			</div>
			<div>
				{new Intl.DateTimeFormat( 'en-GB', {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				}).format( currentDate )}
			</div>
		</Widget>
	);
};

export default DateTime;
