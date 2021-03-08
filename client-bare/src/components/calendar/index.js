import React, { useEffect } from 'react';
import { loadCalendarEvents } from './slice';
import { useDispatch, useSelector } from 'react-redux';

// componenets
import Widget from '../common/widget';
import WidgetHeader from '../common/widgetHeader';

// style
import './style.css';

const Calendar = () => {
	const dispatch = useDispatch();
	const { events } = useSelector( state => state.calendar );
	const { lastFetchStatus } = useSelector( state => state.calendar );

	useEffect( () => {
		dispatch( loadCalendarEvents() );
	}, [ loadCalendarEvents ] );

	const parseDates = ( start, end, isAllDay ) => {
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

	return (
		<Widget>
			<WidgetHeader title="Events" lastUpdated={new Date().toLocaleString()} lastFetchStatus={lastFetchStatus} />
			<ul className="events">
				{!!events.length && events.map( ( item, index ) => (
					<li className="event" key={index}>
						<div>{item.name}</div>
						<div>{parseDates( item.start, item.end, item.isAllDay )}</div>
					</li> )
				)}
			</ul>
		</Widget>
	);
};

export default Calendar;
