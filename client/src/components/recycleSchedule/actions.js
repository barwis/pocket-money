
export const SET_SCHEDULE_FETCH_STATE = 'SET_SCHEDULE_FETCH_STATE';
export const SET_LAST_UPDATED = 'SET_LAST_UPDATED'
export const LOAD_SCHEDULE = 'LOAD_SCHEDULE';

export const setScheduleFetchState = isFetching => ({
	type: SET_SCHEDULE_FETCH_STATE,
	payload: { isFetching }
});


// export const loadSchedule = () => async (dispatch, getState) => {
// export const loadTodos = () => async (dispatch, getState) => {

export const loadTodos = () => async ( dispatch, getState ) => {
	dispatch(setScheduleFetchState(true));
	try {
		const response = await fetch('http://localhost:5000/recycle');
		const schedule = await response.json();
		dispatch({
			type: LOAD_SCHEDULE,
			payload: { schedule }
		})
	} catch (e) {
	} finally {
		dispatch(setScheduleFetchState(false));

	}
}
