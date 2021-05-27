import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	settingsOpen: true,

	components: {
		dateTime: {
			title: 'Date and time',
			isVisible: true
		},
		weather: {
			title: 'Current weather',
			isVisible: true
		},
		forecast: {
			title: 'Weather forecast',
			isVisible: true
		},
		recycle: {
			title: 'Recycle schedule',
			isVisible: true
		},
		calendar: {
			title: 'Calendar',
			isVisible: true
		}
	}
};

const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		toggleView ( state, action ) {
			state.settingsOpen = !state.settingsOpen;
		},
		toggleComponent ( state, action ) {
			const prevState2 = state.components[action.payload].isVisible;
			state.components[action.payload].isVisible = !prevState2;
		}
	}
});

export const { toggleView, toggleComponent } = settingsSlice.actions;
export default settingsSlice.reducer;
