import React from 'react';
import styled from 'styled-components';
import SectionHeader from '../sectionHeader/sectionHeader';


const Time = styled.div`
display: block;
text-align: center;
`;


const DateTime = () => {
	return (
		<section id="date-time">
			<SectionHeader title='Orpington' subtitle='UK'/>
			<Time>16:29</Time>
		</section>
	);

}

export default DateTime;