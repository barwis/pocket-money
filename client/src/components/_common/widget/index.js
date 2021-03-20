import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Widget = ({ className, children }) => {
	return (
		<div className={ ( className || '' ) + ' widget-wrapper'}>
			{children}
		</div>
	);
};

Widget.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};

Widget.defaultProps = {
	className: '',
	children: React.createElement( 'div' )
};

export default Widget;
