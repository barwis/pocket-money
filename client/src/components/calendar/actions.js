import fetchWithTimeout from '../../utils/fetchWithTimeout';

export const LOAD_EVENTS = 'LOAD_EVENTS';
export const SET_CALENDAR_FETCH_STATE = 'SET_CALENDAR_FETCH_STATE';

export const setCalendarFetchState = lastFetchStatus => ({
	type: SET_CALENDAR_FETCH_STATE,
	payload: { lastFetchStatus }
});

export const loadEvents = () => async ( dispatch ) => {
	dispatch( setCalendarFetchState( 'fetching' ) );
	try {
		const response = await fetchWithTimeout( 'http://localhost:5000/calendar' );
		const events = await response.json();
		const parsed = events.map( item => ({
			name: item.summary,
			start: item.start.date || item.start.dateTime,
			end: item.end.date || item.end.dateTime,
			isAllDay: !!item.start.date
		}) );

		dispatch({
			type: LOAD_EVENTS,
			payload: {
				events: parsed,
				lastUpdated: new Date()
			}
		});
		dispatch( setCalendarFetchState( 'ok' ) );
	} catch ( e ) {
		dispatch( setCalendarFetchState( 'error' ) );
	}
};
