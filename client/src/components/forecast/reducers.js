import { createSlice } from '@reduxjs/toolkit'
import fetchWithTimeout from '../../utils/fetchWithTimeout';

import componentInitialState from '../componentsInitialState';

export const initialState = { data: [{ icon: '', temp: '', day: ''}], ...componentInitialState };


const slice = createSlice({
    name: 'forecast',	// state name
    initialState: { data: [{ icon: '', temp: '', day: ''}], ...componentInitialState },
    reducers: {
		setFetchState: ( state, action ) => {
			state.lastFetchStatus = action.payload
		},
		loadForecastData: (state, action ) => {
			state.data = action.payload
		}
    },
});

export default slice.reducer

export const { setFetchState, loadForecastData } = slice.actions;

export const loadForecast = () => async ( dispatch, getState ) => {
	dispatch(setFetchState('fetching'));
	try {
		const response = await fetchWithTimeout('http://localhost:5000/forecast');
		const weatherData = await response.json();
		dispatch(loadForecastData(weatherData));
		dispatch(setFetchState('ok'));
	} catch (e) {
		dispatch(setFetchState('error'));
	}
}
