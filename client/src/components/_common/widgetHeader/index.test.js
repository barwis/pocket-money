import React from 'react';
import { shallow, mount } from 'enzyme';
import WidgetHeader from '.';
// import PropTypes from 'prop-types';

describe( 'WidgetHeader', () => {
	it( 'should render correctly', () => {
		const component = shallow( <WidgetHeader /> );

		expect( component ).toMatchSnapshot();
	});

	it( 'should render correctly with props', () => {
		const props = {
			title: 'test title',
			subtitle: 'test subtitle',
			lastUpdated: 'today'
		};

		const component = mount( <WidgetHeader {...props} /> );

		expect( component.prop( 'title' ) ).toEqual( props.title );
		expect( component.prop( 'subtitle' ) ).toEqual( props.subtitle );
		expect( component.prop( 'lastUpdated' ) ).toEqual( props.lastUpdated );
	});

	it( 'should test functions in defaultProps', () => {
		const component = mount( <WidgetHeader /> );

		const props = component.props();

		expect( props.onUpdateClick ).not.toThrow();
	});

	it( 'should render subtitle if subtitle prop is passed', () => {
		const props = { subtitle: 'test subtitle' };

		const component = shallow( <WidgetHeader {...props} /> );
		expect( component.find( '.subtitle' ) ).toHaveLength( 1 );
	});

	it( 'should not render subtitle if subtitle prop is not passed', () => {
		const component = shallow( <WidgetHeader/> );
		expect( component.find( '.subtitle' ) ).toHaveLength( 0 );
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
		expect( component.find( '.updateInfo .strong' ) ).toHaveLength( 1 );
		expect( component.find( '.updateInfo .strong' ).text() ).toEqual( props.lastUpdated );
	});
});
