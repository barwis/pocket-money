import React from 'react';
import styled from 'styled-components';

const Heading = styled.header`
	padding: 16px;
	margin: 0;
	font-size: 16px;
	font-weight: 500;
	line-height: 20px;
	color: rgba(0, 0, 0, 0.87);
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

const SectionHeader = ({title, subtitle,  lastUpdated, isFetching }) => {
	return (
		<Heading>
			{ title }
			{ subtitle && <Subtitle>, {subtitle}</Subtitle> }
			{ isFetching && <div className="lds-dual-ring"></div> }
			{ lastUpdated && <span><Icon className='icon-update'></Icon> <Strong>{lastUpdated}</Strong></span> }
		</Heading>
	)
}
export default SectionHeader;