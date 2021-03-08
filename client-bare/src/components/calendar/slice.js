import { createSlice } from '@reduxjs/toolkit';

import componentInitialState from '../componentsInitialState';
import fetchWithTimeout from '../../utils/fetchWithTimeout';

export const initialState = {
	events: [],
	...componentInitialState
};

const slice = createSlice({
	name: 'calendar',
	initialState: {
		events: [],
		...componentInitialState
	},
	reducers: {
		setFetchState: ( state, action ) => {
			state.lastFetchStatus = action.payload;
		},
		loadEvents: ( state, action ) => {
			state.events = action.payload;
		}
	}
});

export default slice.reducer;

export const { setFetchState, loadEvents } = slice.actions;

export const loadCalendarEvents = () => async ( dispatch ) => {
	dispatch( setFetchState( 'fetching' ) );
	try {
		const response = await fetchWithTimeout( 'http://localhost:5000/calendar' );
		const events = await response.json();
		const parsed = events.map( item => ({
			name: item.summary,
			start: item.start.date || item.start.dateTime,
			end: item.end.date || item.end.dateTime,
			isAllDay: !!item.start.date
		}) );

		dispatch( loadEvents( parsed ) );
		dispatch( setFetchState( 'ok' ) );
	} catch ( e ) {
		dispatch( setFetchState( 'error' ) );
	}
};
