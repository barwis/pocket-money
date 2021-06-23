import React, { useRef, useEffect, useState } from 'react';
import Snap from 'snapsvg';
import symbols, { items } from './symbols';
import { Icon } from '../utils/strokeAnimate';
import './style.css';

const SvgIcon = () => {
	const [ snap, setSnap] = useState( null );
	const svgRef = useRef( null );
	const [scale, setScale ] = useState( 1 );

	useEffect( () => {
		const s = Snap( `#${svgRef.current.id}` );
		setScale( s.node.clientHeight / s.attr( 'viewBox' ).width );
		setSnap( s );
	}, [svgRef] );

	useEffect( () => {
		if ( snap ) {
			const icon = new Icon( snap );
			icon.setScale( scale );
			icon.loadSymbols( symbols ).then( () => {
				// icon.defsToItems();

				icon.loadlements( items );
				console.log( 'symbols', icon.symbols );
				icon.loadMasks( items );

				// icon.animateAnimated();
			});
		}
	}, [snap] );

	return (
		<div>
			<svg
				ref={svgRef}
				id="svg"
				width="256"
				height="256"
				version="1.1"
				viewBox="0 0 64 64"
				xmlns="http://www.w3.org/2000/svg"
				style={{
					position: 'absolute',
					display: 'block',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}}
			/>
		</div>
	);
};

export default SvgIcon;
