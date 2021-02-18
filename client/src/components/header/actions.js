export const UPDATE_TITLE = 'UPDATE_TITLE';

export const updateTitle = title => ({
    type: UPDATE_TITLE ,
    payload: { title }
});

export const UPDATE_DATE = 'UPDATE_DATE'
export const updateDate = () => ({
	type: UPDATE_DATE
});

export const FETCH_DATA = 'FETCH_DATA';
export const fetchData = isFetching => ({
	type: FETCH_DATA,
	payload: { isFetching }
});