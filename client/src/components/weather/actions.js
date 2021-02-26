export const SET_WEATHER_FETCH_STATE = 'SET_WEATHER_FETCH_STATE';
export const LOAD_WEATHER_DATA = 'LOAD_WEATHER_DATA';

export const setFetchState = isFetching => ({
	type: SET_WEATHER_FETCH_STATE,
	payload: { isFetching }
});

export const loadWeather = () => async ( dispatch, getState ) => {
	dispatch(setFetchState(true));
	try {
		const response = await fetch('http://localhost:5000/weather');
		const weatherData = await response.json();
		dispatch({
			type: LOAD_WEATHER_DATA,
			payload: { weatherData }
		})
	} catch (e) {
	} finally {
		dispatch(setFetchState(false));
	}	
}

