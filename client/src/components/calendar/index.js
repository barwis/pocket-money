import React from 'react';
import { useDispatch, useSelector } from '../../utils/redux-hooks';

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
			<div className="events">
				{!!events.length && events.map( ( item, index ) => (
					<>
						<div className="event__name">
							<div className="wrap">
								<span>{item.name}</span>
								<span>{item.name}</span>
							</div>
						</div>
						<div className="event__date">{parseDates( item.start, item.end, item.isAllDay )}</div>
					</>
				) )}
			</div>
		</Widget>
	);
};

export default Calendar;
