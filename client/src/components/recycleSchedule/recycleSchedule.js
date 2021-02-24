import React, { useEffect } from 'react';
import {connect } from 'react-redux';
import { loadTodos } from './actions';

import RecycleScheduleRow from './recycleScheduleRow';
import styled from 'styled-components';

import Widget from '../../containers/widget';

import './recycleSchedule.css';


const RecycleTable = styled.table`
	font-size: 12px;
	border-collapse: collapse;

	th {
		line-height: 2;
		text-align: right;
		border-bottom: 1px solid #535353;
	}

	th:first-child {
		text-align: left;

	}

	th:first-child {
		width: 50%;
	}

	tr td {
		line-height: 2;
		/* border-bottom: 1px solid #535353; */
		font-weight: 400;
	}
	tr td,
	tr th {
	}

	tr:last-child td {
		border-bottom: none;
	}

	tr td:not(:first-child) {
		text-align: right;
	}

`;



const RecycleSchedule = ({loadTodos, schedule, ...props}) => {
	useEffect(() => {
		loadTodos();
	}, [loadTodos])
    return (
		// <Widget title="Recycle schedule" isFetching={isFetching} lastUpdated={lastUpdated} >
		<Widget title="RecycleSchedule" {...props}>
			<RecycleTable>
				<tbody>
					{
					schedule.map( (item, index) => <RecycleScheduleRow key={index} scheduleRowData={item}/>)
					}
				</tbody>
			</RecycleTable>
		</Widget>
    )
}

const mapStateToProps = state => ({ 
	schedule: state.recycleSchedule.schedule,
	lastUpdated: state.recycleSchedule.lastUpdated,
	isFetching: state.recycleSchedule.isFetching
})

const mapDispatchToProps = dispatch => ({
	loadTodos: () => dispatch(loadTodos())
});

export default connect(mapStateToProps, mapDispatchToProps)(RecycleSchedule);