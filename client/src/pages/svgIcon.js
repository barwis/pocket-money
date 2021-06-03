import React, { useRef, useEffect } from 'react';
import Snap from 'snapsvg';
import './style.css';

const SvgIcon = () => {
	const canvasRef = useRef( null );

	useEffect( () => {
		// const canvas = canvasRef.current;
		const s = Snap( '#svg' );
		Snap.load( 'http://192.168.50.68:5555/weather/64x64/day/svg/sun.svg', onSVGLoaded );

		function onSVGLoaded ( data ) {
			// const group = s.g();
			// group.append( data );
			var sunSymbol = data.select( '#asd' );
			console.log( sunSymbol.toString() );
			s.append( sunSymbol );
			s.use( 'asd' );
			// s.append( group );
			// s.append( data );
		}
	}, [] );

	return (
		<div>svg icon
			<svg
				id="svg"
				width="112px"
				height="112px"
				version="1.1"
				viewBox="0 0 64 64"
				xmlns="http://www.w3.org/2000/svg"
				style={{
					margin: '0 auto',
					display: 'block',
					outline: '1px solid white'
				}}
			/>
		</div>
	);
};

export default SvgIcon;
