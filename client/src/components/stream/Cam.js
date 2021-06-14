import React from 'react';
import PropTypes from 'prop-types';

import { LazyLoadImage } from 'react-lazy-load-image-component';

const Placeholder = () => <span>loading...</span>;

import './style.css';

const Cam = ({ index, isPlaying, isSelected, img, deviceName, onCamClick }) => {
	const handleClick = () => {
		if ( !isSelected ) {
			onCamClick( index );
		}
	};
	let cn = 'thumbnail ';
	if ( isSelected ) cn += ' selected';
	if ( isPlaying ) cn += ' playing';

	return (
		<li key={index} onClick={handleClick} className={cn}>
			{isPlaying && <span className="status">playing</span>}

			<span className="name">{deviceName}</span>

			<LazyLoadImage
				// beforeLoad={() => { console.log( 'lazyLoading...' ); }}
				placeholder={<Placeholder />}
				alt={deviceName}
				height={180}
				src={img}
				width={320} />
		</li>
	);
};

Cam.propTypes = {
	index: PropTypes.number,
	isPlaying: PropTypes.bool,
	isSelected: PropTypes.bool,
	img: PropTypes.string,
	deviceName: PropTypes.string,
	onCamClick: PropTypes.func
};

export default Cam;
