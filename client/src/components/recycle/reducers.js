import {
	LOAD_SCHEDULE,
	SET_LAST_UPDATED,
	SET_SCHEDULE_FETCH_STATE
} from './actions';

import componentInitialState from '../componentsInitialState';

const initialState = {
	schedule: [],
	...componentInitialState
};

export const recycleSchedule = ( state = initialState, action ) => {
	const { type, payload } = action;

	switch ( type ) {
	case SET_SCHEDULE_FETCH_STATE:
		return {
			...state,
			lastFetchStatus: payload.lastFetchStatus
		};
	case SET_LAST_UPDATED:
		return {
			...state,
			lastUpdated: new Date().now()
		};
	case LOAD_SCHEDULE:
		return {
			...state,
			lastFetchStatus: payload.lastFetchStatus,
			lastUpdated: new Date( payload.schedule[0].lastUpdated ).toLocaleDateString(),
			schedule: payload.schedule
		};
	default:
		return state;
	}
};
