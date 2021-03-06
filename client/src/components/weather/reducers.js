import {
	LOAD_IMAGE,
	LOAD_WEATHER_DATA,
	SET_LAST_FETCH_STATUS,
	SET_WEATHER_FETCH_STATE
} from './actions';

import componentInitialState from '../componentsInitialState'

export const initialState = { data: {location: {}, current: { condition: { image: '' }} }, ...componentInitialState };

export const weather = (state = initialState, action) => {
	const { type, payload } = action;

    switch (type) {
	case SET_WEATHER_FETCH_STATE:
		return {
			...state,
			lastFetchStatus: payload.lastFetchStatus
		}
	case LOAD_WEATHER_DATA: 
		return {
			...state, 
			data: payload.weatherData
		}
	case SET_LAST_FETCH_STATUS:
		return {
			...state,
			data: payload.lastFetchSuccessful
		}
	case LOAD_IMAGE:
		return {
			...state,
			data: { 
				...state.data,
				current: {
					...state.data.current,
					condition: {
						...state.data.current.condition,
						image: payload.image.url
					}
				}
			}
		}
	default:
		return state;
	}
};
