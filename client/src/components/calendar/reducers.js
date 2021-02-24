import {
	LOAD_EVENTS,
	SET_FETCH_STATE
} from './actions';

export const initialState = { events: [], isFetching: false, lastUpdated: '-'}

export const calendarReducer = ( state = initialState, action ) => {
	const { type, payload } = action;

	switch ( type ) {
	case SET_FETCH_STATE:
		return {
			...state, 
			isFetching: payload.isFetching
		}
	case LOAD_EVENTS:
		return {
			...state, 
			events: payload.events,
			lastUpdated: payload.lastUpdated
		}
	default:
		return state;
	}
}