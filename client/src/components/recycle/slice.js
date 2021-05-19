import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchWithTimeout from '../../utils/fetchWithTimeout';

// state
import componentInitialState from '../componentsInitialState';

const initialState = {
	schedule: [],
	...componentInitialState
};

// actions
export const loadRecycleSchedule = createAsyncThunk(
	'recycle/loadRecycleSchedule',
	async () => {
		const response = await fetchWithTimeout( `http://192.168.50.164:5000/recycle` );
		const schedule = await response.json();
		return schedule;
	}
);

const slice = createSlice({
	name: 'recycle',
	initialState,
	reducers: {
		setFetchState: ( state, action ) => {
			state.lastFetchStatus = action.payload;
		}
	},
	extraReducers: builder => {
		builder.addCase( loadRecycleSchedule.pending, ( state, action ) => {
			state.lastFetchStatus = 'fetching';
		});
		builder.addCase( loadRecycleSchedule.fulfilled, ( state, action ) => {
			state.lastFetchStatus = 'ok';
			state.schedule = action.payload;
			state.lastUpdated = new Date().toLocaleString();
		});
		builder.addCase( loadRecycleSchedule.rejected, ( state, action ) => {
			state.lastFetchStatus = 'error';
			state.lastUpdated = new Date().toLocaleString();
		});
	}
});

export default slice.reducer;
