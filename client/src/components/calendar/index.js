import React from 'react';
import { fetchCalendarEvents } from './slice';
import { useDispatch, useSelector } from '../../utils/redux-hooks';

// componenets
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';

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
	const { events, lastFetchStatus } = useSelector( state => ({
		events: state.calendar.events,
		lastFetchStatus: state.calendar.lastFetchStatus
	}) );

	React.useEffect( () => {
		dispatch( fetchCalendarEvents() );
	}, [ fetchCalendarEvents ] );

	return (
		<Widget>
			<WidgetHeader title="Events" lastUpdated={new Date().toLocaleString()} lastFetchStatus={lastFetchStatus} />
			<ul className="events">
				{!!events.length && events.map( ( item, index ) => (
					<li className="event" key={index}>
						<div className="event__name">{item.name}</div>
						<div className="event__date">{parseDates( item.start, item.end, item.isAllDay )}</div>
					</li> )
				)}
			</ul>
		</Widget>
	);
};

export default Calendar;
