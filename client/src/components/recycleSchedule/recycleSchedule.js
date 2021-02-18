import React, { useEffect} from 'react';
import {connect } from 'react-redux';
import { loadTodos } from './actions';

import RecycleScheduleRow from './recycleScheduleRow';

import './recycleSchedule.css';

const RecycleSchedule = ({ schedule, lastUpdated, onUpdateClick }) => {
	
	useEffect(() => {
		onUpdateClick();
	}, [])
    return (
        <section className="widget">
			<h3>Recycle schedule
				<span>last updated: {lastUpdated}</span>
			</h3>
			{/* <RecycleScheduleRow scheduleRowData={schedule[0]}/> */}
			{/* <span>schedule length: {schedule.length} </span> */}
			<table>
				<tbody>
					<tr>
						<th>Service Name</th>
						<th>Last Updated</th>
						<th>Last Service</th>
						<th>Next Service</th>
					</tr>
					{
					schedule.map( (item, index) => <RecycleScheduleRow key={index} scheduleRowData={item}/>)
					}
				</tbody>
			</table>
		</section>
    )
}

const mapStateToProps = state => ({ 
	schedule: state.recycleSchedule.schedule,
	lastUpdated: state.recycleSchedule.lastUpdated
	// currentDate: state.header.date
})

// const RecycleRow = (data) => (<li>dupa</li>);

const mapDispatchToProps = dispatch => ({
	onUpdateClick: () => dispatch(loadTodos())
	// asdasd: () => dispatch(updateTitle('tojemoje')),
	// updateDate: () => dispatch(updateDate())
});

export default connect(mapStateToProps, mapDispatchToProps)(RecycleSchedule);