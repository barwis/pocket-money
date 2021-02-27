import {
	SET_WEATHER_FETCH_STATE,
	LOAD_WEATHER_DATA,
	LOAD_IMAGE
} from './actions';

export const initialState = { data: {location: {}, current: { condition: { image: '' }} }, isFetching: false};

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
