import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchWithTimeout from '../../utils/fetchWithTimeout';

import componentInitialState from '../componentsInitialState';

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
	reducers: {}
});

export default slice.reducer;
