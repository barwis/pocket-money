import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components/macro';
import Widget from '../../containers/widget';

import { loadForecast } from './actions'

import { initialState  } from './reducers';

const ForecastData = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	justify-content: space-between;
	grid-gap: 10px;
	width: 100%;
`;

const ForecastDay = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;

	span {
		height: 20px;
		display: block;
	}
	span div {
		display: inline;
	}
`;


const Icon = styled.div`
display: block;
width: 100%;
height: 0;
padding-top: 100%;
position: relative;

img {
	position: absolute;
	width: 100%;
	top: 0;
	left:0;
}
`;



const Forecast = ({ forecast = initialState, loadForecast,  ...props }) => {

	useEffect(() => {
		loadForecast();

		// const intervalId = setInterval(() => {
		// 	loadForecast();
		// }, 600000);

		// return () => clearInterval(intervalId);
	}, [loadForecast])

	return (
		<Widget title="Forecast" lastUpdated={new Date().toLocaleString()} onUpdateClick={loadForecast} {...props}>
			<ForecastData>
				{forecast.map( (item, index) => {
					return (<ForecastDay key={index}>
						<span>{item.day}</span>
						<Icon><img src={item.icon} alt={item.day} /></Icon>
						<span>{item.temp}{!!item.temp && <div>&deg;C</div>}</span>
					</ForecastDay>)
				})}
			</ForecastData>
		</Widget>
	)
}

const mapStateToProps = state => ({ 
	forecast: state.forecast.data,
	isFetching: state.forecast.isFetching
})
const mapDispatchToProps = dispatch => ({
	loadForecast: () => dispatch(loadForecast())
});


export default connect(mapStateToProps, mapDispatchToProps)(Forecast)
