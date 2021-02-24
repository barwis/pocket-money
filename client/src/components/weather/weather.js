import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadWeather } from './actions';
import styled from 'styled-components/macro';

// import SectionHeader from '../sectionHeader/sectionHeader';
import Widget from '../../containers/widget';

const Condition = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
`;

const Temp = styled.div`
display: flex;
flex-direction: column;
margin-left: 20px;`;


const TempReal = styled.div`
    font-size: 550%;
    font-weight: 300;
`;


const TempFeelsLike = styled.div`
color: #777777`;

const WeatherDetails = styled.ul`
	display: flex;
	justify-content: space-between;
	margin: 20px 0;
	padding: 0 40px;
	width: 100%;
    box-sizing: border-box;
`;


const WeatherDetailListItem = styled.li`
	display:  flex;
	flex-direction: column;
	text-align: center;

	div {
		display: block;
	}

	div:first-child {
		font-size: 300%;
		margin-bottom: 10px;
	}
	sup {
		padding-left: 3px;
	}
`;


const Weather = ({ data, loadData }) => {
	useEffect(() => {
		loadData();
	}, [loadData])
	return (
		<Widget title={data.location && data.location.name} subtitle='UK' lastUpdated={data.current && data.current.last_updated && (new Date(data.current.last_updated)).toLocaleString()}>
			<Condition>
				<div>
					<img src={data.current && data.current.condition && data.current.condition.icon } alt={data.current && data.current.condition && data.current.condition.text }/>
				</div>
				<Temp>
					<TempReal>{(data.current && data.current.temp_c) || '-'}&deg;</TempReal>
					<TempFeelsLike>Feels like {(data.current && data.current.feelslike_c) || '-'}&deg;</TempFeelsLike>
				</Temp>
			
			</Condition>
			<WeatherDetails>
					<WeatherDetailListItem>
						<div className="icon-wind">
						</div>
						<div>{data.current && Math.round(data.current.wind_kph)}<sup>km/h</sup></div>
					</WeatherDetailListItem>
					<WeatherDetailListItem>
						<div className="icon-raindrop"></div>
						<div>{data.current && data.current.humidity}<sup>%</sup></div>
					</WeatherDetailListItem>
					<WeatherDetailListItem>
						<div className="icon-raindrops"></div>
						<div>{data.current && data.current.precip_mm}<sup>mm</sup></div>
					</WeatherDetailListItem>
					<WeatherDetailListItem>
						<div className="icon-cloud-download"></div>
						<div>{data.current && data.current.pressure_mb}<sup>hPa</sup></div>
					</WeatherDetailListItem>
					
				</WeatherDetails>

		</Widget>
	)
}


const mapStateToProps = state => ({ 
	data: state.weather.data
});

const mapDispatchToProps = dispatch => ({
	loadData: () => dispatch(loadWeather())
});

export default connect(mapStateToProps, mapDispatchToProps)(Weather)