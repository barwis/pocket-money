import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as ReactReduxHooks from '../../utils/redux-hooks';
import Calendar, { parseDates } from './';
import reducer, { fetchCalendarEvents, fetchSuccessful, fetchPending, fetchFailed, initialState, setFetchState, loadEvents } from './slice';

import { calendarMockResponse } from './mocks';

const testState = {
	...initialState,
	events: [
		{
			name: 'test 1',
			start: '2021-03-11T01:00:00Z',
			end: '2021-03-11T02:00:00Z',
			isAllDay: true
		},
		{
			name: 'test 2',
			start: '2022-03-11T01:00:00Z',
			end: '2022-03-11T02:00:00Z',
			isAllDay: false
		}
	]
};

// import { fetchCalendarEvents } from './slice';

global.fetch = jest.fn( () =>
	Promise.resolve({ json: () => Promise.resolve( calendarMockResponse ) })
);

describe( 'Calendar', () => {
	let wrapper;
	let useEffect;
	let mockStore;

	const mockUseEffect = () => {
		useEffect.mockImplementationOnce( f => f() );
	};

	beforeEach( () => {
		// mock store
		mockStore = configureStore( [thunk] )( testState );

		// mock useEffect
		useEffect = jest.spyOn( React, 'useEffect' );
		mockUseEffect();

		// mock useSelector
		jest
			.spyOn( ReactReduxHooks, 'useSelector' )
			.mockImplementation( state => mockStore.getState() );

		// mock useDispatch
		jest
			.spyOn( ReactReduxHooks, 'useDispatch' )
			.mockImplementation( () => mockStore.dispatch );

		// shallow render
		wrapper = shallow( <Calendar store={mockStore} /> );
		fetch.mockClear();
	});

	it( 'renders properly', () => {
		expect( wrapper.find( '.events' ).children().length ).toEqual( testState.events.length );
		expect( wrapper.find( 'WidgetHeader' ).props().lastFetchStatus ).toEqual( testState.lastFetchStatus );
	});

	it( 'calls parseDates', () => {
		const event1 = testState.events[0];
		const event2 = testState.events[1];
		const date1 = parseDates( event1.start, event1.end, event1.isAllDay );
		const date2 = parseDates( event2.start, event2.end, event2.isAllDay );
		expect(
			wrapper
				.find( '.event__date' )
				.first()
				.text()
		).toEqual( date1 );

		expect(
			wrapper
				.find( '.event__date' )
				.last()
				.text()
		).toEqual( date2 );
	});
});

describe( 'calendar slice', () => {
	describe( 'createAsyncThunk', () => {
		it( 'should call fetchCalendarEvents', async () => {
			const state = reducer( initialState, fetchPending );
			const expectedState = {
				...initialState,
				lastFetchStatus: 'fetching'
			};
			expect( state ).toEqual( expectedState );
		});
	});
	describe( 'reducers', () => {
		it( 'should return initialState ', () => {
			const nextState = initialState;
			const result = reducer( undefined, {});
			expect( result ).toEqual( nextState );
		});

		it( 'setFetchState should set state.lastFetchStatus', () => {
			const state = initialState;
			const fetchState = 'test';
			const nextState = reducer( initialState, setFetchState( fetchState ) );
			const expectedState = {
				...state,
				lastFetchStatus: fetchState
			};
			expect( nextState ).toEqual( expectedState );
		});
	});

	describe( 'extrareducers', () => {
		const mockLastUpdated = 'foo';

		jest.spyOn( Date.prototype, 'toLocaleString' ).mockReturnValue( mockLastUpdated );

		it( 'updats state when fetchCalendarEvents is pending', () => {
			const action = { type: fetchCalendarEvents.pending.type };
			const state = reducer( initialState, action );
			const expectedState = {
				...initialState,
				lastFetchStatus: 'fetching'
			};
			expect( state ).toEqual( expectedState );
		});

		it( 'updats state when fetchCalendarEvents is fulfilled', () => {
			const payload = testState.events;
			const action = {
				type: fetchCalendarEvents.fulfilled.type,
				payload
			};
			const state = reducer( initialState, action );
			const expectedState = {
				...testState,
				lastUpdated: mockLastUpdated,
				lastFetchStatus: 'ok'
			};
			expect( expectedState ).toEqual( state );
		});

		it( 'updats state when fetchCalendarEvents return error', () => {
			const action = { type: fetchCalendarEvents.rejected.type };
			const state = reducer( initialState, action );
			const expectedState = {
				...initialState,
				lastUpdated: mockLastUpdated,
				lastFetchStatus: 'error'
			};
			expect( expectedState ).toEqual( state );
		});
	});
});
