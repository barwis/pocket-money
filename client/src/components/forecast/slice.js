import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchWithTimeout from '../../utils/fetchWithTimeout';

import componentInitialState from '../componentsInitialState';

export const initialState = {
	data: [ {
		icon: '',
		temp: '',
		day: ''
	} ],
	...componentInitialState
};

export const fetchForecast = createAsyncThunk(
	'forecast/fetchForecast',
	async () => {
		const response = await fetchWithTimeout( 'http://localhost:5000/forecast' );
		const weatherData = await response.json();
		return weatherData;
	}
);

const slice = createSlice({
	name: 'forecast',
	initialState: {
		data: [ {
			icon: '',
			temp: '',
			day: ''
		} ],
		...componentInitialState
	},
	reducers: {
		setFetchState: ( state, action ) => {
			state.lastFetchStatus = action.payload;
		}
	},
	extraReducers: builder => {
		builder.addCase( fetchForecast.pending, ( state, action ) => {
			state.lastFetchStatus = 'fetching';
		});
		builder.addCase( fetchForecast.fulfilled, ( state, action ) => {
			state.lastFetchStatus = 'ok';
			state.data = action.payload;
		});
		builder.addCase( fetchForecast.rejected, ( state, action ) => {
			state.lastFetchStatus = 'error';
		});
	}
});

export default slice.reducer;
