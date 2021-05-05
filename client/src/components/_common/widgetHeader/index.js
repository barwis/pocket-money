import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const WidgetHeader = ({ title, subtitle, lastUpdated, onUpdateClick, lastFetchStatus }) => {
	const lastUpdatedClassName = lastFetchStatus === 'fetching' ? 'lastUpdated lastUpdated--fetching' : 'lastUpdated';
	return (
		<div className="heading">
			<div className="mainInfo">
				<div className="title">{ title }</div>
				{ !!subtitle && <div className="subtitle">, {subtitle}</div> }
				{ lastFetchStatus === 'fetching' && <div className="lds-dual-ring"></div> }
			</div>
			<span className="updateInfo" onClick={onUpdateClick}>
				<div className={lastUpdatedClassName}>{lastUpdated}</div> <i className='icon icon-update'></i>
			</span>
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
	lastUpdated: '',
	onUpdateClick: () => {}
};

export default WidgetHeader;
