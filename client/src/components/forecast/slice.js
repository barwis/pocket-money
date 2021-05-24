import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchWithTimeout from '../../utils/fetchWithTimeout';

import componentInitialState from '../componentsInitialState';
import { conditions } from '../../utils';

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
		console.log( 'fetchForecast' );
		const response = await fetchWithTimeout( `http://${LOCAL_IP}:5000/forecast` );
		const data = await response.json();

		console.log( 'data0', data );

		data.forEach( item => {
			const sorted = conditions.getDataBy({
				property: 'code',
				value: item.code
			});
			item.externalData = sorted;
		});

		console.log( 'data', data );

		return data;
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
			state.lastUpdated = new Date().toLocaleString();
		});

		builder.addCase( fetchForecast.rejected, ( state, action ) => {
			state.lastFetchStatus = 'error';
			state.lastUpdated = new Date().toLocaleString();
		});
	}
});

export default slice.reducer;
