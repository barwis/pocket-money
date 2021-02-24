import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import Widget from '../../containers/widget';

const Time = styled.div`
	display: block;
	text-align: center;
	font-size: 4rem;
    font-weight: 200;
	margin: 40px;
`;

const Separator = styled.span`
display: inline-block;
text-align: center;
width: 10px;`;

const DateTime = () => {
	const [ currentDate, setCurrentDate ] = useState(new Date())
	const [tick, setTick] = useState(true);

	const separator = tick ? ":" : " ";
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentDate(new Date());
			setTick(!tick);
		}, 1000);
		return () => clearInterval(timer);
	  }, [tick]);

	// useEffect()
	return (
		<Widget>
			<Time>{currentDate.getHours()}<Separator>{separator}</Separator>{(currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes()}</Time>
			<div>{new Intl.DateTimeFormat('en-GB', { weekday: 'long'}).format(currentDate)}, </div>
			<div>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric'}).format(currentDate)}  </div>
		</Widget>
	);

}

export default DateTime;