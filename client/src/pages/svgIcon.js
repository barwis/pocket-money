import React, { useRef, useEffect, useState } from 'react';
import Snap from 'snapsvg';
import symbols, { items } from './symbols';
import { Icon } from '../utils/strokeAnimate';
import './style.css';

// const mytest = [
// 	{ foo: 1 },
// 	{
// 		foo: 2,
// 		children: [
// 			{ foo: 2.1 },
// 			{
// 				foo: 2.2,
// 				children: [
// 					{ foo: 2.21 },
// 					{ foo: 2.22 }
// 				]
// 			}, { foo: 2.3 }
// 		]
// 	},

// 	{ foo: 3 }
// ];

// const traverse = ( arr, parent = null ) => {
// 	arr.forEach( item => {
// 		console.log({
// 			'item!': item.foo,
// 			parent
// 		});
// 		if ( item.children ) {
// 			traverse( item.children, item.foo );
// 		}
// 		return item;
// 	});
// };

// traverse( mytest );

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
			icon.loadSymbols( symbols, scale ).then( () => {
				// icon.defsToItems();

				icon.loadlements( items );

				icon.applyMasks();
				icon.animateAnimated();
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
