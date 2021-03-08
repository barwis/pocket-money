import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Widget = ({ children }) => <div className="widget-wrapper"> {children}</div>;

Widget.propTypes = { children: PropTypes.node };

export default Widget;
