import React from 'react';
import { useDispatch, useSelector } from '../../utils/redux-hooks';

/* istanbul ignore file */
import { useState, useRef } from 'react';

// componenets
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';

// actions
import { fetchCalendarEvents } from './slice';

// utils
import { dataUpdate } from '../../utils';

// style
import './style.css';

export 	const parseDates = ( start, end, isAllDay ) => {
	const date1 = new Date( start );
	const dateOptions = {
		weekday: 'short',
		day: '2-digit',
		month: 'short'
	};

	let formattedDate = date1.toLocaleDateString( 'en-GB', dateOptions );
	if ( !isAllDay ) {
		formattedDate = date1.toLocaleTimeString( 'en-GB', {
			hour: '2-digit',
			minute: '2-digit'
		}) + ', ' + formattedDate;
	}
	return formattedDate;
};

const Calendar = () => {
	const dispatch = useDispatch();
	const itemEls = useRef( [] );
	const [flatEvents, setFlatEvents] = useState( [] );

	const {
		events,
		lastFetchStatus,
		lastUpdated
	} = useSelector( state => state.calendar );

	React.useEffect( () => {
		return dataUpdate( dispatch, fetchCalendarEvents, 600000 );
	}, [ dispatch ] );

	React.useEffect( () => {
		if ( events.length > 0 ) {
			flattenEvents( events );
		}
	}, [events] );

	React.useEffect( () => {
		itemEls.current
			.filter( item => item?.className === 'event__name' )
			.forEach( ( item, index ) => detect( item, index ) );
		console.log({
			itemEls,
			flatEvents
		});
	}, [flatEvents] );

	const flattenEvents = ( arr ) => {
		const newFlat = [ ];

		arr.forEach( item => {
			newFlat.push({
				id: 'name',
				value: item.name
			});
			newFlat.push({
				id: 'date',
				value: parseDates( item.start, item.end, item.isAllDay )
			});
		});

		setFlatEvents( newFlat );
	};

	const detect = ( node, index ) => {
		const nodeWidth = node.clientWidth;
		const nodeChildWidth = node.className === 'event__name' && node.querySelector( '.wrap' ).clientWidth;
		const spans = node.querySelectorAll( ' .wrap span' );
		const animatedClassName = 'animated';

		if ( nodeWidth < nodeChildWidth ) {
			spans.forEach( span => { span.classList.add( animatedClassName ); });
		} else {
			spans.forEach( span => { span.classList.remove( animatedClassName ); });
		}
	};

	const pushmaybe = ( item, index ) => {
		itemEls.current[index] = item;
	};

	return (
		<Widget>
			<WidgetHeader
				title="Events"
				lastUpdated={lastUpdated}
				lastFetchStatus={lastFetchStatus}
				onUpdateClick={() => dispatch( fetchCalendarEvents() ) }
			/>
			<div className="events">
				{!!flatEvents.length > 0 && flatEvents.map( ( item, index ) => {
					const className = `event__${item.id}`;
					return (
						<div ref={( element ) => pushmaybe( element, index )} key={index} className={className}>
							{item.id === 'name' && <div className="wrap"><span>{item.value}</span><span>{item.value}</span></div>}
							{item.id === 'date' && item.value}
						</div>
					);
				})}
			</div>
		</Widget>
	);
};

export default Calendar;
