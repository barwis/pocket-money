import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTodos } from './actions';

import RecycleScheduleRow from './recycleScheduleRow';
// import styled from 'styled-components/macro';

import Widget from '../../containers/widget';

import './recycleSchedule.css';

// const RecycleScheduleContainer = styled.div`
// 	display: flex;

// 	[class^="icon-"] {
// 		font-size: 400%;
// 		margin-bottom: 10px;
// 	}
// `;

const RecycleSchedule = ({ loadTodos, schedule, lastFetchStatus }) => {
	useEffect( () => {
		loadTodos();

		// const intervalId = setInterval(() => {
		// 	loadTodos();
		// }, 5000);

		// return () => clearInterval(intervalId);
	}, [ loadTodos ] );

	return (
		// <Widget title="Recycle schedule" isFetching={isFetching} lastUpdated={lastUpdated} >
		<Widget title="RecycleSchedule" lastUpdated={new Date().toLocaleString()} onUpdateClick={loadTodos} lastFetchStatus={lastFetchStatus}>
			<div>
				{
					schedule.map( ( item, index ) => <RecycleScheduleRow key={index} scheduleRowData={item}/> )
				}
			</div>
		</Widget>
	);
};

RecycleSchedule.propTypes = {
	loadTodos: PropTypes.func,
	schedule: PropTypes.array,
	lastFetchStatus: PropTypes.string
};

const mapStateToProps = state => ({
	schedule: state.recycleSchedule.schedule,
	lastFetchStatus: state.recycleSchedule.lastFetchStatus
});

const mapDispatchToProps = dispatch => ({ loadTodos: () => dispatch( loadTodos() ) });

export default connect( mapStateToProps, mapDispatchToProps )( RecycleSchedule );
