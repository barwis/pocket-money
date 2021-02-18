import {
	UPDATE_TITLE,
	UPDATE_DATE,
	FETCH_DATA
} from './actions';

const initialState = { title: 'test', date: new Date().toLocaleTimeString(), isFetching: false };

export const header = (state = initialState, action) => {
	const { type, payload } = action;

    switch (type) {
	case UPDATE_TITLE:
		return {
			...state,
			title: payload.title,
		};
	case UPDATE_DATE:
		return {
			...state,
			date: new Date().toLocaleTimeString()
		}
	case FETCH_DATA:
		return {
			...state,
			isFetching: payload.isFetching
		}
	default:
		return state;
	}
};