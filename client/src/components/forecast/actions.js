export const SET_FORECAST_FETCH_STATE = 'SET_FORECAST_FETCH_STATE';
export const LOAD_FORECAST_DATA = 'LOAD_FORECAST_DATA';

export const setFetchState = lastFetchStatus => ({
	type: SET_FORECAST_FETCH_STATE,
	payload: { lastFetchStatus }
});

export const loadForecast = () => async ( dispatch, getState ) => {
	dispatch(setFetchState('fetching'));
	try {
		const response = await fetch('http://localhost:5000/forecast');
		const weatherData = await response.json();
		dispatch({
			type: LOAD_FORECAST_DATA,
			payload: { weatherData }
		})
		dispatch(setFetchState('ok'));
	} catch (e) {
		dispatch(setFetchState('error'));
	}
}

