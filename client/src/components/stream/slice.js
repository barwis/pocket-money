import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import fetchWithTimeout from '../../utils/fetchWithTimeout';
import componentInitialState from '../componentsInitialState';

const initialStreamUrl = {
	rtspsUrl: null,
	wsUrl: null
};

export const initialState = {
	devices: [{ initialStreamUrl }],
	streamingDeviceId: null,
	streamStatus: 'stopped',
	...componentInitialState
};

export const fetchDevices = createAsyncThunk(
	'arlo/fetchDevices',
	async () => {
		const response = await fetchWithTimeout( `http://${LOCAL_IP}:${API_PORT}/arlo/devices` );
		const devices = await response.json();
		return devices;
	}
);
export const startStream = createAsyncThunk(
	'arlo/startStream',
	async ( deviceName ) => {
		const response = await fetchWithTimeout( `http://${LOCAL_IP}:${API_PORT}/arlo/startStream`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ deviceName })
		});

		const result = await response.json();
		return result;
	}
);

export const stopStream = createAsyncThunk(
	'arlo/stopStream',
	async () => {
		const response = await fetchWithTimeout( `http://${LOCAL_IP}:${API_PORT}/arlo/stopStream`, { method: 'POST' });
		return response.status;
	}
);

export const slice = createSlice({
	name: 'arlo',
	initialState: { ...initialState },
	reducers: {
		setDevicePlaying ( state, action ) {
			// console.log( 'pupka', current( state ) );
		},
		clearPlayingDevice ( state, action ) {
			console.log( 'slice.js:58,  clearPlayingDevice' );
			state.streamingDeviceId = null;
		}
	},
	extraReducers: builder => {
		builder.addCase( fetchDevices.pending, ( state, action ) => {
			state.lastFetchStatus = 'fetching';
		});
		builder.addCase( fetchDevices.fulfilled, ( state, action ) => {
			state.lastFetchStatus = 'ok';
			state.devices = action.payload;
			state.lastUpdated = new Date().toLocaleString();
		});
		builder.addCase( fetchDevices.rejected, ( state, action ) => {
			state.lastFetchStatus = 'error';
			state.lastUpdated = new Date().toLocaleString();
		});
		builder.addCase( startStream.pending, ( state, action ) => {
			state.lastFetchStatus = 'fetching';
			state.streamStatus = 'pending';
		});
		builder.addCase( startStream.fulfilled, ( state, action ) => {
			console.log( 'action', action );
			const streamUrl = action.payload;
			const deviceName = action.meta.arg;
			state.streamStatus = 'streaming';

			const devices = current( state ).devices.map( device => {
				if ( device.deviceName === deviceName ) {
					return {
						...device,
						streamUrl
					};
				} else {
					return {
						...device,
						streamUrl: initialStreamUrl
					};
				}
			});
			console.log( 'devices', devices );
			state.devices = devices;
			state.streamingDeviceId = deviceName;
			state.lastFetchStatus = 'ok';
			state.lastUpdated = new Date().toLocaleString();
		});

		builder.addCase( startStream.rejected, ( state, action ) => {
			state.lastFetchStatus = 'error';
			state.lastUpdated = new Date().toLocaleString();
			state.streamStatus = 'error';
		});
		builder.addCase( stopStream.pending, ( state, action ) => {
			state.lastFetchStatus = 'fetching';
			state.streamStatus = 'stopping';
		});
		builder.addCase( stopStream.fulfilled, ( state, action ) => {
			state.lastFetchStatus = 'ok';
			state.lastUpdated = new Date().toLocaleString();
			state.streamingDeviceId = null;
			state.streamStatus = 'stopped';

			const devices = current( state ).devices.map( device => {
				return {
					...device,
					streamUrl: initialStreamUrl
				};
			});
			state.devices = devices;
		});
		builder.addCase( stopStream.rejected, ( state, action ) => {
			state.streamStatus = 'error';
			state.lastFetchStatus = 'error';
			state.lastUpdated = new Date().toLocaleString();
		});
	}
});
export const { setDevicePlaying, clearPlayingDevice } = slice.actions;
export default slice.reducer;
