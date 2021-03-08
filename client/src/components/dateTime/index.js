import React, { useState, useEffect } from 'react';
// import styled from 'styled-components/macro';
import Widget from '../../containers/widget';

import './style.css';

const DateTime = () => {
	const [ currentDate, setCurrentDate ] = useState( new Date() );
	const [ tick, setTick ] = useState( true );

	const separator = tick ? ':' : ' ';
	useEffect( () => {
		const timer = setInterval( () => {
			setCurrentDate( new Date() );
			setTick( !tick );
		}, 1000 );
		return () => clearInterval( timer );
	}, [ tick ] );

	// useEffect()

	return (
		<Widget>
			<div className="time">{currentDate.getHours()}<div className="separator">{separator}</div>{( currentDate.getMinutes() < 10 ? '0' : '' ) + currentDate.getMinutes()}</div>
			<div>{new Intl.DateTimeFormat( 'en-GB', { weekday: 'long' }).format( currentDate )}, </div>
			<div>{new Intl.DateTimeFormat( 'en-GB', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			}).format( currentDate )}  </div>
		</Widget>
	);
};

export default DateTime;
