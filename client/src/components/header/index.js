import React, { useEffect } from 'react';
import {connect } from 'react-redux';
import { updateTitle, updateDate } from './actions';

const Header = ({ title, currentDate, asdasd, updateDate }) => {
	
	useEffect(() => {
	}, [])
    return (
        <header>
			welcome {title} 
		</header>
    )
}

const mapStateToProps = state => ({ 
	title: state.header.title,
	currentDate: state.header.date
})

const mapDispatchToProps = dispatch => ({
	asdasd: () => dispatch(updateTitle('tojemoje')),
	updateDate: () => dispatch(updateDate())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);