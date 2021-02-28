import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadWeather } from './actions';
import styled from 'styled-components/macro';

// import SectionHeader from '../sectionHeader/sectionHeader';
import Widget from '../../containers/widget';
import code from './countriesList';

const Condition = styled.div`
display: grid;
grid-gap: 30px;
align-items: center;
grid-template-columns: 1fr 1fr;
padding: 10px 33px 20px 60px;
`;

const Temp = styled.div`
display: flex;
flex-direction: column;
`;

const TempReal = styled.div`
	font-size: 55px;
    line-height: 1;
    font-weight: 100;
	margin-top: -15px;
`;


const TempFeelsLike = styled.div`
	color: #afafaf;
	font-size: 14px;
	white-space: nowrap;
`;

const WeatherDetails = styled.ul`
display: grid;
grid-template-columns: repeat(4, 1fr);
grid-template-rows: 1fr 1fr;
margin: 0;
grid-column-gap: 50px;
padding: 0;
width: 100%;

`;


const WeatherDetailListItem = styled.li`
	display:  flex;
    flex-direction: row;
    text-align: center;
    justify-content: center;

	div {
		display: block;
	}

	div:first-child {
		font-size: 300%;
	}
	sup {
		padding-left: 3px;
	}
`;

const WeatherImage = styled.img`
	display: block;
    width: 112px;
    height: 112px;
	opacity: ${props => (props.src ? '1' : '0')};

	.cls-1 {
		fill:none;
		stroke:#f1c40f;
		stroke-miterlimit:1;
		stroke-width:3px;
		shape-rendering:geometricPrecision;
		stroke-linecap: round; 
		stroke-linejoin: round;
	}
`;

export const Weather = ({ data = [], loadData, ...props }) => {
	useEffect( () => {
		loadData();

	}, [loadData])


	
	return (
		<Widget title={data.location && data.location.name} subtitle={data.location && code(data.location.country)} lastUpdated={new Date().toLocaleString()} onUpdateClick={loadData} {...props}>
			<Condition>
				<div>
					 {/* <img src={data.current && data.current.condition && data.current.condition.icon } alt={data.current && data.current.condition && data.current.condition.text }/> */}
					 {/* { data.current && <WeatherImage src="" />} */}
					 <WeatherImage src={data.current.condition.image} alt={data.current.condition.text} />
					 {/* { http://localhost:5000/img/weather/64x64/day/fallback/185.svg.png } */}
					{/* <WeatherImage src="http://localhost:3000/weather/64x64/day/svg/113.svg" alt={data.current && data.current.condition.icon}/> */}
				</div>
				<Temp>
					<TempReal>{(data.current && data.current.temp_c) || '-'}&deg;</TempReal>
					<TempFeelsLike>Feels like {(data.current && data.current.feelslike_c) || '-'}&deg;</TempFeelsLike>
				</Temp>
			
			</Condition>
			<WeatherDetails>
					<WeatherDetailListItem>
						<div className="icon-wind"> </div>
					</WeatherDetailListItem>
					<WeatherDetailListItem>
						<div className="icon-raindrop"></div>
					</WeatherDetailListItem>
					<WeatherDetailListItem>
						<div className="icon-raindrops"></div>
					</WeatherDetailListItem>
					<WeatherDetailListItem>
						<div className="icon-cloud-download"></div>
					</WeatherDetailListItem>
					<WeatherDetailListItem>{data.current && Math.round(data.current.wind_kph)}<sup>km/h</sup></WeatherDetailListItem>
					<WeatherDetailListItem>{data.current && data.current.humidity}<sup>%</sup></WeatherDetailListItem>
					<WeatherDetailListItem>{data.current && data.current.precip_mm}<sup>mm</sup></WeatherDetailListItem>
					<WeatherDetailListItem>{data.current && data.current.pressure_mb}<sup>hPa</sup></WeatherDetailListItem>


				</WeatherDetails>
		</Widget>
	)
}


const mapStateToProps = state => ({ 
	data: state.weather.data,
	isFetching: state.weather.isFetching
});

const mapDispatchToProps = dispatch => ({
	loadData: () => dispatch(loadWeather())
});

export default connect(mapStateToProps, mapDispatchToProps)(Weather)
// export default Weather;