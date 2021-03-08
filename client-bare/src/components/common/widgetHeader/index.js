import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const WidgetHeader = ({ title, subtitle, lastUpdated, onUpdateClick }) => {
	return (
		<div className="heading">
			<div className="title">{ title }</div>
			{ !!subtitle && <div className="subtitle">, {subtitle}</div> }
			<div className="updateInfo" onClick={onUpdateClick}>
				<i className='icon icon-update'></i> <div className="strong">{lastUpdated}</div>
			</div>
		</div>
	);
};

WidgetHeader.propTypes = {
	title: PropTypes.string,
	subtitle: PropTypes.string,
	lastUpdated: PropTypes.string,
	lastFetchStatus: PropTypes.string,
	onUpdateClick: PropTypes.func
};

WidgetHeader.defaultProps = {
	title: '',
	subtitle: '',
	lastUpdated: '-',
	onUpdateClick: () => {}
};

export default WidgetHeader;
