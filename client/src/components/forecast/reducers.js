import {
	SET_FORECAST_FETCH_STATE,
	LOAD_FORECAST_DATA
} from './actions';

import componentInitialState from '../componentsInitialState'

export const initialState = { data: [{ icon: '', temp: '', day: ''}], ...componentInitialState };

export const forecastReducer = (state = initialState, action) => {
	const { type, payload } = action;

    switch (type) {
	case SET_FORECAST_FETCH_STATE:
		return {
			...state,
			lastFetchStatus: payload.lastFetchStatus
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
