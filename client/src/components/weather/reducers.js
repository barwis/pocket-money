import {
	SET_FETCH_STATE,
	LOAD_WEATHER_DATA
} from './actions';


const initialState = { data: [], isFetching: false};

export const weather = (state = initialState, action) => {
	const { type, payload } = action;

    switch (type) {
	case SET_FETCH_STATE:
		return {
			...state,
			isFetching: payload.isFetching
		}
	case LOAD_WEATHER_DATA: 
		return {
			...state, 
			data: payload.data
		}
	default:
		return state;
	}
};