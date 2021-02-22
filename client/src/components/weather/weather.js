import React from 'react';
import { connect } from 'react-redux';

import SectionHeader from '../sectionHeader/sectionHeader';

const Weather = ({ data }) => {
	return (
		<section id="weather">
			<SectionHeader title='Orpington' subtitle='UK'/>
		</section>
	)
}

const mapStateToProps = state => ({ 
	data: state.weather.data
});

export default connect(mapStateToProps)(Weather)