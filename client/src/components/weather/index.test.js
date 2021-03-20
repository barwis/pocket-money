import React from 'react';
import { shallow } from 'enzyme';

import Calendar from './';

describe( 'Weather component', () => {
	it( 'should render properly', () => {
		const wrapper = shallow( <Calendar/> );
		expect( wrapper.find( '.weather' ) ).toHaveLength( 1 );
	});
});
