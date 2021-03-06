import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchWithTimeout from '../../utils/fetchWithTimeout';

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

export const logIconUsage = createAsyncThunk(
	'weather/logIconUsage',
	async ( icon ) => {
		const response = await fetchWithTimeout( `http://${LOCAL_IP}:${API_PORT}/weather`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
			body: `icon=${encodeURIComponent( icon )}`
		});
		const result = await response.json();
		return result;
	}, {
		condition: ( name, { getState, extra }) => {
			const state = getState();
			const icon = state.weather.data.current.condition.icon;
			return !!icon;
		}
	}
);

export const loadWeatherIcon = createAsyncThunk(		// TODO: move this to backend
	'weather/loadWeatherIcon',
	async ( name ) => {
		// http://192.168.50.229:${API_PORT}/img/weather/64x64/day/113.svg.png
		const url = `http://${LOCAL_IP}:${API_PORT}/img/weather/64x64/day/${name}.svg.png`;
		const response = await fetch( url );
		const data = await response.json();
		return data;
	}, {
		condition: ( name, { getState, extra }) => {
			const state = getState();
			return !!state.weather.data.current.condition.icon;
		}
	}
);

export const logIconUsagefetchSuccessful = logIconUsage.fulfilled;
export const logIconUsagefetchPending = logIconUsage.pending;
export const logIconUsagefetchFailed = logIconUsage.rejected;

export const loadWeatherIconfetchSuccessful = logIconUsage.fulfilled;
export const loadWeatherIconfetchPending = logIconUsage.pending;
export const loadWeatherIconfetchFailed = logIconUsage.rejected;

export const fetchWeather = createAsyncThunk(
	'weather/fetchWeather',
	async () => {
		const response = await fetchWithTimeout( `http://${LOCAL_IP}:${API_PORT}/weather` );
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
			state.lastUpdated = new Date().toLocaleString();
		});
		builder.addCase( fetchWeather.rejected, ( state, action ) => {
			state.lastFetchStatus = 'error';
			state.lastUpdated = new Date().toLocaleString();
		});
		builder.addCase( loadWeatherIcon.pending, ( state, action ) => {
			state.data.current.condition.status = 'fetching';
		});
		builder.addCase( loadWeatherIcon.rejected, ( state, action ) => {
			state.data.current.condition.status = 'error';
			console.log( 'loadWeatherIcon.rejected', action );
		});
		builder.addCase( loadWeatherIcon.fulfilled, ( state, action ) => {
			state.data.current.condition.status = 'ok';
			state.data.current.condition.localIcon = action.payload.url;
		});
		builder.addCase( logIconUsage.rejected, ( state, action ) => {
			console.log( 'rejected, reason:', action );
		});
	}
});

export default slice.reducer;
