import React from 'react';
import { shallow } from 'enzyme';

import Weather from './';
import configureStore from 'redux-mock-store';

import * as ReactReduxHooks from '../../utils/redux-hooks';
import { initialState } from './slice';
import thunk from 'redux-thunk';

import { weatherMockResponse } from './mocks';

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

global.fetch = jest.fn( () =>
	Promise.resolve({ json: () => Promise.resolve( weatherMockResponse ) })
);

describe( 'Weather component', () => {
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
		wrapper = shallow( <Weather store={mockStore} /> );	// proooobably an overkill, passing the store
		fetch.mockClear();
	});
	it( 'should render properly', () => {
		expect( wrapper.hasClass( 'weather' ) ).toBe( true );
	});
});
