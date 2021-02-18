import React from 'react';


const RecycleScheduleRow = ({scheduleRowData}) => {
	let { serviceName, lastUpdated, lastService, nextService } = scheduleRowData;
	
	const parseDate = date => {
		return !!date ? new Date(date).toLocaleDateString() : '-'
	}

	return (
		<tr>
			<td>{serviceName || '-'}</td>
			<td>{parseDate(lastUpdated)}</td>
			<td>{parseDate(lastService)}</td>
			<td>{parseDate(nextService)}</td>

		</tr>
	);
}

export default RecycleScheduleRow;