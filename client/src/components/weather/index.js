import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadWeather } from './actions';
// import styled from 'styled-components/macro';

// import SectionHeader from '../sectionHeader/sectionHeader';
import Widget from '../../containers/widget';
import code from './countriesList';

// const Condition = styled.div`
// 	display: grid;
// 	grid-gap: 30px;
// 	align-items: center;
// 	grid-template-columns: 1fr 1fr;
// 	padding: 10px 33px 20px 60px;
// `;

// const Temp = styled.div`
// 	display: flex;
// 	flex-direction: column;
// `;

// const TempReal = styled.div`
// 	font-size: 55px;
//     line-height: 1;
//     font-weight: 100;
// 	margin-top: -15px;
// `;

// const TempFeelsLike = styled.div`
// 	color: #afafaf;
// 	font-size: 14px;
// 	white-space: nowrap;
// `;

// const WeatherDetails = styled.ul`
// 	display: grid;
// 	grid-template-columns: repeat(4, 1fr);
// 	grid-template-rows: 1fr 1fr;
// 	margin: 0;
// 	grid-column-gap: 50px;
// 	padding: 0;
// 	width: 100%;
// `;

// const WeatherImage = styled.img`
// 	display: block;
//     width: 112px;
//     height: 112px;
// 	opacity: ${props => ( props.src ? '1' : '0' )};

// 	.cls-1 {
// 		fill:none;
// 		stroke:#f1c40f;
// 		stroke-miterlimit:1;
// 		stroke-width:3px;
// 		shape-rendering:geometricPrecision;
// 		stroke-linecap: round;
// 		stroke-linejoin: round;
// 	}
// `;

// const li = styled.li`
// 	display:  flex;
//     flex-direction: row;
//     text-align: center;
//     justify-content: center;

// 	div {
// 		display: block;
// 	}

// 	div:first-child {
// 		font-size: 300%;
// 	}
// 	sup {
// 		padding-left: 3px;
// 	}
// `;

export const Weather = ({ data = [], loadData, lastFetchStatus }) => {
	useEffect( () => {
		loadData();
	}, [ loadData ] );

	return (
		<Widget title={( data.location && data.location.name ) || 'Weather'} subtitle={data.location && code( data.location.country )} lastUpdated={new Date().toLocaleString()} onUpdateClick={loadData} lastFetchStatus={lastFetchStatus}>
			<div>
				<div>
					 <div className="weather-image" src={data.current.condition.image} alt={data.current.condition.text} />
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

Weather.propTypes = {
	data: PropTypes.array,
	loadData: PropTypes.func,
	lastFetchStatus: PropTypes.string
};

const mapStateToProps = state => ({
	data: state.weather.data,
	lastFetchStatus: state.weather.lastFetchStatus
});

const mapDispatchToProps = dispatch => ({ loadData: () => dispatch( loadWeather() ) });

export default connect( mapStateToProps, mapDispatchToProps )( Weather );
