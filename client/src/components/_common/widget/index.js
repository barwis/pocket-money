import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Widget = ({ className, children }) => {
	return (
		<div className={ 'widget-wrapper ' + ( className || '' ) }>
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
