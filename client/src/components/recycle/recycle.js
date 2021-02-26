import React, { useEffect } from 'react';
import {connect } from 'react-redux';
import { loadTodos } from './actions';

import RecycleScheduleRow from './recycleScheduleRow';
import styled from 'styled-components/macro';

import Widget from '../../containers/widget';

import './recycleSchedule.css';

const RecycleScheduleContainer = styled.div`
display: flex;

[class^="icon-"] {
	font-size: 400%;
	margin-bottom: 10px;
}
`;


const RecycleSchedule = ({loadTodos, schedule, ...props}) => {
	useEffect(() => {
		loadTodos();

		// const intervalId = setInterval(() => {
		// 	loadTodos();
		// }, 5000);

		// return () => clearInterval(intervalId);
	}, [loadTodos])
    return (
		// <Widget title="Recycle schedule" isFetching={isFetching} lastUpdated={lastUpdated} >
		<Widget title="RecycleSchedule" lastUpdated={new Date().toLocaleString()} onUpdateClick={loadTodos} {...props}>
			<RecycleScheduleContainer>
					{
					schedule.map( (item, index) => <RecycleScheduleRow key={index} scheduleRowData={item}/>)
					}
			</RecycleScheduleContainer>
		</Widget>
    )
}

const mapStateToProps = state => ({ 
	schedule: state.recycleSchedule.schedule,
	isFetching: state.recycleSchedule.isFetching
})

const mapDispatchToProps = dispatch => ({
	loadTodos: () => dispatch(loadTodos())
});

export default connect(mapStateToProps, mapDispatchToProps)(RecycleSchedule);