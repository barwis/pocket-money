import React from 'react';
import { shallow, mount } from 'enzyme';
import WidgetHeader from '.';
// import PropTypes from 'prop-types';

describe( 'WidgetHeader', () => {
	it( 'should render subtitle if subtitle prop is passed', () => {
		const props = { subtitle: 'test subtitle' };

		const component = shallow( <WidgetHeader {...props} /> );
		const subtitle = component.find( '.subtitle' );
		expect( subtitle ).toHaveLength( 1 );
		expect( subtitle.text() ).toEqual( `, ${props.subtitle}` );
	});

	it( 'should not render subtitle if subtitle prop is not passed', () => {
		const component = shallow( <WidgetHeader/> );
		expect( component.find( '.subtitle' ) ).toHaveLength( 0 );
	});

	it( 'should show spinner on lastFetchStatus prop is set to \'fetching\'', () => {
		const component = shallow( <WidgetHeader lastFetchStatus="fetching"/> );
		expect( component.find( '.icon.icon-update' ) ).toHaveLength( 1 );
	});

	it( 'should render children properly', () => {
		const props = {
			title: 'test title',
			subtitle: 'test subtitle',
			lastUpdated: 'today'
		};

		const component = shallow( <WidgetHeader {...props} /> );

		expect( component.find( '.heading' ) ).toHaveLength( 1 );
		expect( component.find( '.updateInfo' ) ).toHaveLength( 1 );
		expect( component.find( '.updateInfo .lastUpdated' ) ).toHaveLength( 1 );
		expect( component.find( '.updateInfo .lastUpdated' ).text() ).toEqual( props.lastUpdated );
	});
});
