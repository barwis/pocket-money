import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithTimeout } from '../../../utils';

export const handleLogin = createAsyncThunk(
	'calendar/fetchCalendarEvents',
	async ( googleData ) => {
		const response = await fetchWithTimeout( `http://${LOCAL_IP}:${API_PORT}/auth`, {
			method: 'POST',
			body: JSON.stringify({ token: googleData.tokenId }),
			headers: { 'Content-Type': 'application/json' }
		});

		const events = await response.json();
		console.log({ events });
	}
);

export const slice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: false,
		data: {}
	},
	reducers: {
		logIn: ( state, action ) => {
			state.isLoggedIn = true;
			state.data = action.payload;
		},
		logOut: ( state, action ) => {
			state.isLoggedIn = false;
			state.data = {};
		}
	}
});

export const { logIn, logOut } = slice.actions;
export default slice.reducer;
