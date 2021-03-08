import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadEvents } from './actions';
import Widget from '../../containers/widget';

import './style.css';

const Calendar = ({ events, loadEvents, lastFetchStatus }) => {
	useEffect( () => {
		loadEvents();
	}, [ loadEvents ] );

	const parseDates = ( start, end, isAllDay ) => {
		const date1 = new Date( start );
		const dateOptions = {
			weekday: 'short',
			day: '2-digit',
			month: 'short'
		};
		// const dateTimeOptions = {hour: '2-digit', minute: '2-digit', weekday: 'short', day: '2-digit', month: 'short'}

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
		<Widget title="Events" lastUpdated={new Date().toLocaleString()} onUpdateClick={loadEvents} lastFetchStatus={lastFetchStatus} >
			<ul className="events">
				{!events.length && lastFetchStatus !== '-' && <li>no upcoming events</li> }
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

Calendar.propTypes = {
	events: PropTypes.array,
	loadEvents: PropTypes.func,
	lastFetchStatus: PropTypes.string
};

const mapStateToProps = state => ({
	events: state.calendar.events,
	lastFetchStatus: state.calendar.lastFetchStatus
});

const mapDispatchToProps = dispatch => ({ loadEvents: () => dispatch( loadEvents() ) });

// export default Calendar;
export default connect( mapStateToProps, mapDispatchToProps )( Calendar );
