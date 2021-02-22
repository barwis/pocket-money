import React from 'react';


const RecycleScheduleRow = ({scheduleRowData}) => {
	let { serviceName, nextService } = scheduleRowData;
	
	// const parseDate = date => {
	// 	// if ( !!date ) 
	// 	// 	return 0;
	// 	// 	const date1 = new Date(date);
	// 	// 	const date2 = new Date();
	// 	// 	const diff = date1.getTime() - date2.getTime();
	// 	return !!date ? new Date(date).toLocaleDateString() : '-';
	// }

	const nth = function(d) {
		if (d > 3 && d < 21) return 'th';
		switch (d % 10) {
		  case 1:  return "st";
		  case 2:  return "nd";
		  case 3:  return "rd";
		  default: return "th";
		}
	}

	const daysDiff = (date) => {
		var date1 = new Date(date);
		var date2 = new Date();

		const diff = date1.getTime() - date2.getTime();

		var days = Math.ceil(diff / (1000 * 3600 * 24));
		return days;
	}

	const formatDaysDifference = date => {
		let humanString = [];
		if ( date === '' )
			return false;
		let parsedDate  = new Date(date)


		// const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
		const shortWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let weekday = shortWeekdays[parsedDate.getDay() -1]
		const diff = daysDiff(date);

		if (diff > 7 ) {
			humanString.push('next');
		}

		weekday = weekday > 7 ? 'next ' + weekday : weekday;
		const dom = parsedDate.getDate();
		const ordinal = nth(parsedDate.getDate());
		// weekday += nth(parsedDate.getDate())
		const monthName = monthNames[parsedDate.getMonth()];

		return {
			weekday,
			dom,
			diff,
			ordinal,
			monthName,
		}
	}

	const nextDate = formatDaysDifference(nextService);

	return (
		<tr>
			<td>{serviceName || '-'}</td>
			{/* <td>{parseDate(lastUpdated)} </td>
			<td>{parseDate(lastService)}</td> */}
			<td>

				{nextDate.weekday}, {nextDate.dom}<sup>{nextDate.ordinal}</sup> of {nextDate.monthName} (in {nextDate.diff} {nextDate.diff > 1 ? 'days' : 'day'})
			</td>

		</tr>
	);
}

export default RecycleScheduleRow;