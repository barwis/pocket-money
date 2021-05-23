import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// components
import Widget from '../_common/widget';
import WidgetHeader from '../_common/widgetHeader';
import RecycleScheduleRow from './row';

// actions
import { loadRecycleSchedule } from './slice';

// utils
import { dataUpdate } from '../../utils';
// styles
import './style.css';

const Recycle = () => {
	const dispatch = useDispatch();
	// const { schedule, lastFetchStatus } = useSelector( state => state.recycle );

	const {
		schedule,
		lastUpdated,
		lastFetchStatus
	} = useSelector( state => state.recycle );

	useEffect( () => {
		return dataUpdate( dispatch, loadRecycleSchedule, 600000 );
	}, [ dispatch ] );

	return (
		<Widget>
			<WidgetHeader
				title="Recycle"
				onUpdateClick={() => dispatch( loadRecycleSchedule() ) }
				lastUpdated={lastUpdated}
				lastFetchStatus={lastFetchStatus}
			/>
			<div className="recycle-list">
				{ schedule.map( ( item, index ) => <RecycleScheduleRow key={index} scheduleRowData={item}/> ) }
			</div>
		</Widget>
	);
};

export default Recycle;
