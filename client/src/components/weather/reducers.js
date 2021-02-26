import {
	SET_WEATHER_FETCH_STATE,
	LOAD_WEATHER_DATA
} from './actions';

export const initialState = { data: {forecast: { forecastday: []}}, isFetching: false};

export const weather = (state = initialState, action) => {
	const { type, payload } = action;

    switch (type) {
	case SET_WEATHER_FETCH_STATE:
		return {
			...state,
			isFetching: payload.isFetching
		}
	case LOAD_WEATHER_DATA: 
		return {
			...state, 
			data: payload.weatherData
		}
	default:
		return state;
	}
};
