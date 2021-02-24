import React from 'react';
import styled from 'styled-components/macro';
import SectionHeader from '../../components/sectionHeader/sectionHeader';


const WidgetWrapper = styled.section`
	background: none;
	border-radius: 6px;
	box-shadow: rgb(50 50 93 / 3%) 0px 2px 5px -1px, rgb(0 0 0 / 5%) 0px 1px 3px -1px;
	display: flex;
	color: white;
	flex-direction: column;
	margin: 40px 10px;
	position: relative;
`;


const WidgetBody = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
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
