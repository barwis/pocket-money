export const SET_WEATHER_FETCH_STATE = 'SET_WEATHER_FETCH_STATE';
export const LOAD_WEATHER_DATA = 'LOAD_WEATHER_DATA';
export const LOAD_IMAGE = 'LOAD_IMAGE';
export const SET_LAST_FETCH_STATUS = 'SET_LAST_FETCH_STATUS'


export const setFetchState = lastFetchStatus => ({
	type: SET_WEATHER_FETCH_STATE,
	payload: { lastFetchStatus }
});

export const loadWeather = () => async ( dispatch, getState ) => {
	const { weather }  = getState();
	if ( weather.lastFetchStatus === 'fetching' ) {
		console.log('still fetching...')
		return;
	}

	dispatch(setFetchState('fetching'));
	try {
		const response = await fetch('http://localhost:5000/weather');
		const weatherData = await response.json();
		const icon = weatherData.current.condition.icon;

		dispatch({
			type: LOAD_WEATHER_DATA,
			payload: { weatherData }
		})

		const image = await dispatch(loadIcon(icon));
		dispatch({
			type: LOAD_IMAGE,
			payload: { image }
		})
		dispatch(setFetchState('ok'));
	} catch (e) {
		dispatch(setFetchState('error'));
	}
}

export const loadIcon = (name) => async (dispatch, getState) => {
	// TODO: refactor this!
	const url = `http://localhost:5000/img/weather/64x64/day/fallback/${name}.svg.png`;
	const response = await fetch(url);
	const data = await response.json();
	return data;
}