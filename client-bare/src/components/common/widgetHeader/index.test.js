import React from 'react';
import { shallow, mount, render } from 'enzyme';
import WidgetHeader from './';

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

	it( 'should handle update on click', () => {
		const mockCallBack = jest.fn();

		const button = mount( <WidgetHeader onUpdateClick={mockCallBack} /> );
		button.find( '.updateInfo' ).simulate( 'click' );
		expect( mockCallBack.mock.calls.length ).toEqual( 1 );
	});
});


// wrapper.find('#next-btn-ready-modal').simulate('click');
// expect(baseProps.toggleModal).toHaveBeenCalled();