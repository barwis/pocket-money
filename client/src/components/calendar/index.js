import React from 'react';
import { fetchCalendarEvents } from './slice';
import { useDispatch, useSelector } from '../../utils/redux-hooks';

// componenets
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';

// utils
import dataUpdate from '../../utils/dataUpdate';

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
	const {
		events,
		lastFetchStatus,
		lastUpdated
	} = useSelector( state => state.calendar );

	React.useEffect( () => {
		return dataUpdate( dispatch, fetchCalendarEvents, 600000 );
	}, [ dispatch ] );

	return (
		<Widget>
			<WidgetHeader
				title="Events"
				lastUpdated={lastUpdated}
				lastFetchStatus={lastFetchStatus}
				onUpdateClick={() => dispatch( fetchCalendarEvents() ) }
			/>
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
