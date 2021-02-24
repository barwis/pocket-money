export const LOAD_EVENTS = 'LOAD_EVENTS'
export const SET_FETCH_STATE = 'SET_FETCH_STATE';

export const setCalendarFetchState = isFetching => ({
	type: SET_FETCH_STATE,
	payload: { isFetching }
});

export const loadEvents = () => async ( dispatch, getState ) => {
	dispatch(setCalendarFetchState(true))
	try {
		const response = await fetch('http://localhost:5000/calendar');
		const events = await response.json()
		const parsed = events.map( item => ({ 
			name: item.summary,
			start: item.start.date || item.start.dateTime,
			end: item.end.date || item.end.dateTime,
			isAllDay: !!item.start.date
		}));
		
		dispatch({
			type: LOAD_EVENTS,
			payload: { events: parsed, lastUpdated: new Date() }
		})
	} catch (e) {

	} finally {
		dispatch(setCalendarFetchState(false));
	}
}
