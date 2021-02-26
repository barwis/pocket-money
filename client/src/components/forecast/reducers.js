import {
	SET_FORECAST_FETCH_STATE,
	LOAD_FORECAST_DATA
} from './actions';

export const initialState = { data: [{ icon: '', temp: '', day: ''}], isFetching: false};

export const forecastReducer = (state = initialState, action) => {
	const { type, payload } = action;

    switch (type) {
	case SET_FORECAST_FETCH_STATE:
		return {
			...state,
			isFetching: payload.isFetching
		}
	case LOAD_FORECAST_DATA: 
		return {
			...state, 
			data: payload.weatherData
		}
	default:
		return state;
	}
};
