import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchWithTimeout from '../../utils/fetchWithTimeout';
// const localIpUrl = require('local-ip-url');
var ip = require('ip');

import componentInitialState from '../componentsInitialState';

export const initialState = {
	data: {
		location: {},
		current: {
			condition: {
				image: '',
				status: ''
			}
		}
	},
	...componentInitialState
};

// selectors

export const getImage = state => state.data.current.condition.icon;

export const loadWeatherIcon = createAsyncThunk(
	'weather/loadWeatherIcon',
	async ( name ) => {
		console.log( 'local ip', ip.address() );
		const url = `http://localhost:5000/img/weather/64x64/day/fallback/${name}.svg.png`;
		const response = await fetch( url );
		const data = await response.json();
		return data;
	}, {
		// only load custom icon, when icon set in store
		condition: ( name, { getState, extra }) => {
			const state = getState();
			return !!state.weather.data.current.condition.icon;
		}
	}
);

export const fetchWeather = createAsyncThunk(
	'weather/fetchWeather',
	async () => {
		const response = await fetchWithTimeout( 'http://localhost:5000/weather' );
		const weatherData = await response.json();
		return weatherData;
	}
);

export const slice = createSlice({
	name: 'weather',
	initialState: { ...initialState },
	reducers: {
		setFetchState: ( state, action ) => {
			state.lastFetchStatus = action.payload;
		}
	},
	extraReducers: builder => {
		builder.addCase( fetchWeather.pending, ( state, action ) => {
			state.lastFetchStatus = 'fetching';
		});
		builder.addCase( fetchWeather.fulfilled, ( state, action ) => {
			state.lastFetchStatus = 'ok';
			state.data = action.payload;
		});
		builder.addCase( fetchWeather.rejected, ( state, action ) => {
			state.lastFetchStatus = 'error';
		});
		builder.addCase( loadWeatherIcon.pending, ( state, action ) => {
			state.data.current.condition.status = 'fetching';
		});
		builder.addCase( loadWeatherIcon.rejected, ( state, action ) => {
			state.data.current.condition.status = 'error';
		});
		builder.addCase( loadWeatherIcon.fulfilled, ( state, action ) => {
			state.data.current.condition.status = 'ok';
			state.data.current.condition.localIcon = action.payload.url;
		});
	}
});

export default slice.reducer;
