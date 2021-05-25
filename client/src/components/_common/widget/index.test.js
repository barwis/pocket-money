import React from 'react';
import { shallow, mount } from 'enzyme';
import '@testing-library/jest-dom';
import Widget from '.';

describe( 'Widget', () => {
	it( 'should render correctly', () => {
		// expect(container.firstChild.classList.contains('foo')).toBe(true)
		const testClass = 'this is some class';
		const component = shallow( <Widget className={testClass} /> );
		expect( component.hasClass( testClass ) ).toBe( true );
		// expect( MockClock ).toBeCalledTimes( 1 );
	});

	it( 'should render children correctly', () => {
		const MockClock = jest.fn( () => <div>test</div> );
		const Children = () => <Widget><MockClock/></Widget>;

		mount( <Children /> );

		expect( MockClock ).toBeCalledTimes( 1 );
	});
});
