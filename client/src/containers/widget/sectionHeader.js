import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Heading = styled.header`
	padding: 16px;
	margin: 0;
	font-size: 16px;
	font-weight: 500;
	line-height: 20px;
	color: white;
`;

const Subtitle = styled.div`
	color: #d1d1d1;
	display: inline;
`;

const Strong = styled.strong`
	line-height: 20px;
	display: inline-block;
	vertical-align: top;
`;

const Icon = styled.i`
	display: inline-block;
	line-height: 20px;
`;

const UpdateInfo = styled.span`
	cursor: pointer;
`;

const SectionHeader = ({ title, subtitle, lastUpdated = '-', lastFetchStatus, onUpdateClick }) => {
	return (
		<Heading>
			{ title }
			{ subtitle && <Subtitle>, {subtitle}</Subtitle> }
			{ lastFetchStatus === 'error' && <div className="icon-notification"></div> }
			{ lastFetchStatus === 'fetching' && <div className="lds-dual-ring"></div> }
			<UpdateInfo onClick={onUpdateClick}><Icon className='icon-update'></Icon> <Strong>{lastUpdated}</Strong></UpdateInfo>
		</Heading>
	);
};

SectionHeader.propTypes = {
	title: PropTypes.string,
	subtitle: PropTypes.string,
	lastUpdated: PropTypes.string,
	lastFetchStatus: PropTypes.string,
	onUpdateClick: PropTypes.func
};

export default SectionHeader;
