import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components/macro';
import SectionHeader from './sectionHeader';

import './style.css';

// const WidgetWrapper = styled.div`
// 	background: none;
// 	border-radius: 6px;
// 	box-shadow: rgb(50 50 93 / 3%) 0px 2px 5px -1px, rgb(0 0 0 / 5%) 0px 1px 3px -1px;
// 	display: flex;
// 	color: white;
// 	flex-direction: column;
// 	margin: 0 10px 40px;
// 	position: relative;
// `;

// const WidgetBody = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	flex: 1;
// 	padding: 16px;
// 	align-items: center;
// 	justify-content: center;
// 	opacity: ${props => ( props.lastFetchStatus === 'ok' ? '1' : '0.3' )};
// `;

const Widget = ( props ) => {
	const { title, subtitle, lastFetchStatus, lastUpdated, children, onUpdateClick } = props;
	return (
		<div className="widget-wrapper">
			<SectionHeader title={title} subtitle={subtitle} lastFetchStatus={lastFetchStatus || 'ok'} lastUpdated={lastUpdated} onUpdateClick={onUpdateClick}/>
			<div className="widget-body" lastFetchStatus={lastFetchStatus}>
				{children}
			</div>
		</div>
	);
};

Widget.propTypes = {
	title: PropTypes.string,
	subtitle: PropTypes.string,
	lastFetchStatus: PropTypes.string,
	lastUpdated: PropTypes.string,
	children: PropTypes.node,
	onUpdateClick: PropTypes.func
};

export default Widget;
