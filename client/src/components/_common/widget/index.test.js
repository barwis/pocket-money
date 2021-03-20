import React from 'react';
import { shallow, render } from 'enzyme';
import '@testing-library/jest-dom';
import Widget from '.';

describe( 'Widget', () => {
	it( 'should render correctly', () => {
		const component = shallow( <Widget /> );
		expect( component ).toMatchSnapshot();
	});

	it( 'should have proper className', () => {
		// expect(container.firstChild.classList.contains('foo')).toBe(true)
		const testClass = 'this is some class';
		const component = render( <Widget className={testClass} /> );
		expect( component.hasClass( testClass ) ).toBe( true );
	});
});
