
export const LOAD_SCHEDULE = 'LOAD_SCHEDULE';
export const SET_LAST_UPDATED = 'SET_LAST_UPDATED'
export const SET_SCHEDULE_FETCH_STATE = 'SET_SCHEDULE_FETCH_STATE';

export const setScheduleFetchState = lastFetchStatus => ({
	type: SET_SCHEDULE_FETCH_STATE,
	payload: { lastFetchStatus }
});

export const loadSchedule = schedule => ({
	type: LOAD_SCHEDULE,
	payload: { schedule }
})

// export const loadSchedule = () => async (dispatch, getState) => {
// export const loadTodos = () => async (dispatch, getState) => {

export const loadTodos = () => async ( dispatch ) => {
	dispatch(setScheduleFetchState('fetching'));
	try {
		const response = await fetch('http://localhost:5000/recycle');
		const schedule = await response.json();
		dispatch(loadSchedule(schedule));
		dispatch(setScheduleFetchState('ok'));
	} catch (e) {
		dispatch(setScheduleFetchState('error'));
	}

}
