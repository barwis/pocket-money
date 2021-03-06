import {
	LOAD_EVENTS,
	SET_CALENDAR_FETCH_STATE
} from './actions';

import componentInitialState from '../componentsInitialState'

export const initialState = { events: [], ...componentInitialState}

export const calendarReducer = ( state = initialState, action ) => {
	const { type, payload } = action;

	switch ( type ) {
	case SET_CALENDAR_FETCH_STATE:
		return {
			...state, 
			lastFetchStatus: payload.lastFetchStatus
		}
	case LOAD_EVENTS:
		return {
			...state, 
			events: payload.events
		}
	default:
		return state;
	}
}