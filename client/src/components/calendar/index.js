import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadEvents } from './actions';
import styled from 'styled-components/macro';


import Widget from '../../containers/widget';


const Events = styled.ul`
box-sizing: border-box;
padding: 0;
margin: 0;
list-style-type: none;
text-align: left;
width: 100%;
`;

const Event = styled.li`
display: flex;
justify-content: space-between;
padding-top: 10px;
font-size: 12px;
`;

const Calendar = ({events, loadEvents, ...props}) => {
	useEffect(() => {
		loadEvents();
	}, [loadEvents])


	const parseDates = (start, end, isAllDay) => {
		const date1 = new Date(start);
		const dateOptions = {weekday: 'short', day: '2-digit', month: 'short'}
		// const dateTimeOptions = {hour: '2-digit', minute: '2-digit', weekday: 'short', day: '2-digit', month: 'short'}

		let formattedDate = date1.toLocaleDateString('en-GB', dateOptions);
		if (!isAllDay) formattedDate = date1.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ', ' + formattedDate
		return formattedDate;

	};

	return (
		<Widget title="Events" lastUpdated={new Date().toLocaleString()} onUpdateClick={loadEvents} {...props} >
			<Events>
			{!!events.length && events.map( (item, index) =>  (
				<Event key={index}>
					<div>{item.name}</div>
					<div>{parseDates(item.start, item.end, item.isAllDay)}</div>
				</Event>)
			)}
			</Events>
		</Widget>
	)
}
const mapStateToProps = state => ({ 
	events: state.calendar.events,
	isFetching: state.calendar.isFetching
})

const mapDispatchToProps = dispatch => ({
	loadEvents: () => dispatch(loadEvents())
});

// export default Calendar;
export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
