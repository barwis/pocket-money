import { createSlice } from '@reduxjs/toolkit';

// slice

const slice = createSlice({
	name: 'sliceTest',	// state name
	initialState: { status: 'ok' },
	reducers: {
		sliceFetch: ( state, action ) => {
			state.status = action.payload;
		}
	},
});

export default slice.reducer;

// actions

const { sliceFetch } = slice.actions;

export const fetchDispatcher = ( fetchState ) => dispatch => {
	dispatch( sliceFetch( fetchState ) );
};
