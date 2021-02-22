import React from 'react';
import { connect } from 'react-redux';

// import SectionHeader from '../sectionHeader/sectionHeader';
import Widget from '../../containers/widget';

const Weather = ({ data }) => {
	return (
		<Widget title='Orpington' subtitle='UK' lastUpdated={'-'}></Widget>
	)
}



const mapStateToProps = state => ({ 
	data: state.weather.data
});

export default connect(mapStateToProps)(Weather)