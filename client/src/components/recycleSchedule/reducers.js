import {
	SET_SCHEDULE_FETCH_STATE,
	LOAD_SCHEDULE
} from './actions';


const initialState = { schedule: [], isFetching: false, lastUpdated: '-' };

export const recycleSchedule = (state = initialState, action) => {
	const { type, payload } = action;

    switch (type) {
	// case UPDATE_TITLE:
	// 	return {
	// 		...state,
	// 		title: payload.title,
	// 	};
	// case UPDATE_DATE:
	// 	return {
	// 		...state,
	// 		date: new Date().toLocaleTimeString()
	// 	}
	// case FETCH_DATA:
	// 	return {
	// 		...state,
	// 		isFetching: payload.isFetching
	// 	}
	case SET_SCHEDULE_FETCH_STATE:
		return {
			...state,
			isFetching: payload.isFetching
		}
	case LOAD_SCHEDULE:
		return {
			...state,
			schedule: payload.schedule,
			lastUpdated: new Date(payload.schedule[0].lastUpdated).toLocaleDateString()
		}
	default:
		return state;
	}
};