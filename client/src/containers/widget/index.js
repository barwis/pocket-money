import React from 'react';
import styled from 'styled-components/macro';
import SectionHeader from '../../components/sectionHeader/sectionHeader';


const WidgetWrapper = styled.section`
	background: white;
	border-radius: 6px;
	box-shadow: rgb(50 50 93 / 3%) 0px 2px 5px -1px, rgb(0 0 0 / 5%) 0px 1px 3px -1px;
	display: flex;
	flex-direction: column;
	margin: 10px;
`;


const WidgetBody = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 100%;
	padding: 16px;
	align-items: center;
	justify-content: center;
`;

const Widget = (props) => {
	const {title, subtitle, isFetching, lastUpdated, children} = props;
	return (
		<WidgetWrapper>
			{title && <SectionHeader title={title}  subtitle={subtitle} isFetching={isFetching || false} lastUpdated={lastUpdated}/>}
			<WidgetBody>
				{children}
			</WidgetBody>
		</WidgetWrapper>
		)
	}
	
	export default Widget
