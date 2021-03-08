import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Row = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	margin: 0 10px;
`;

const RecycleScheduleRow = ({ scheduleRowData }) => {
	let { serviceName, nextService } = scheduleRowData;

	const label = ( nextDateDiff ) => {
		let str = '';
		switch ( nextDateDiff ) {
		case 0:
			str = 'today';
			break;
		case 1:
			str = 'Tomorrow';
			break;
		default:
			str = `in ${nextDateDiff} days`;
			break;
		}
		return str;
	};

	const daysDiff = ( date ) => {
		var date1 = new Date( date );
		var date2 = new Date();

		const diff = date1.getTime() - date2.getTime();

		var days = Math.ceil( diff / ( 1000 * 3600 * 24 ) );
		return label( days );
	};

	const icons = {
		'Food waste': 'icon-food_waste',
		'Paper and cardboard': 'icon-cardboard',
		'Non-recyclable refuse': 'icon-non_recyclable',
		'Plastic, glass and tins': 'icon-recyclable'
	};

	return (
		<Row>
			<div className={icons[serviceName]}></div>
			{ daysDiff( nextService ) }
		</Row>
	);
};

RecycleScheduleRow.propTypes = {
	scheduleRowData: PropTypes.shape({
		serviceName: PropTypes.string,
		nextService: PropTypes.string
	})
};

export default RecycleScheduleRow;
