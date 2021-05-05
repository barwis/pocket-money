import React from 'react';
import PropTypes from 'prop-types';

const RecycleScheduleRow = ({ scheduleRowData }) => {
	let { serviceName, nextService, lastService } = scheduleRowData;

	const label = ( nextDateDiff ) => {
		let str = '';

		// uh oh...
		if ( nextDateDiff < 0 ) {
			return '-';
		}
		switch ( nextDateDiff ) {
		case 0:
			str = 'Today';
			break;
		case 1:
			str = 'Tomorrow';
			break;
		default:
			str = `in ${nextDateDiff} days`;
		}
		return str;
	};

	const daysDiff = ( nextService, lastService ) => {
		let nextServiceDate = new Date( nextService );
		let lastServiceDate = new Date( lastService );
		let currentDate = new Date();

		const toNextService = nextServiceDate.getTime() - currentDate.getTime();
		const sinceLastService = lastServiceDate.getTime() - currentDate.getTime();

		const daysTillNextService = Math.ceil( toNextService / ( 1000 * 3600 * 24 ) );
		const daysSinceLastService = Math.ceil( sinceLastService / ( 1000 * 3600 * 24 ) );
		return daysSinceLastService === 0 ? label( daysSinceLastService ) : label( daysTillNextService );
	};

	const icons = {
		'Food waste': 'icon-food_waste',
		'Paper and cardboard': 'icon-cardboard',
		'Non-recyclable refuse': 'icon-non_recyclable',
		'Plastic, glass and tins': 'icon-recyclable'
	};

	return (
		<div className="recycle-row">
			<div className={icons[serviceName]}></div>
			{ daysDiff( nextService, lastService ) }
		</div>
	);
};

RecycleScheduleRow.propTypes = {
	scheduleRowData: PropTypes.shape({
		serviceName: PropTypes.string,
		nextService: PropTypes.string,
		lastService: PropTypes.string
	})
};

export default RecycleScheduleRow;
