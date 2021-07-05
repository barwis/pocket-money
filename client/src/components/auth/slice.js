import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithTimeout } from '../../utils';

export const handleLogin = createAsyncThunk(
	'auth/handleLogin',
	async ( googleData ) => {
		const response = await fetchWithTimeout( `${PROTOCOL}://${LOCAL_IP}:${API_PORT}/auth`, {
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
	},
	extraReducers: builder => {
		builder.addCase( handleLogin.pending, ( state, action ) => {
		});
		builder.addCase( handleLogin.fulfilled, ( state, action ) => {
			console.log( 'API return', action.payload );
		});
		builder.addCase( handleLogin.rejected, ( state, action ) => {
		});
	}
});

export const { logIn, logOut } = slice.actions;
export default slice.reducer;
