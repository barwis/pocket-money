import React, { useRef, useEffect, useState } from 'react';
import Snap from 'snapsvg';
import symbols from './symbols';
import { AnimateStroke, loadSymbols } from '../utils/strokeAnimate';
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
		// const scale = s.node.clientHeight / s.attr( 'viewBox' ).width;
		setScale( s.node.clientHeight / s.attr( 'viewBox' ).width );
		console.log( s.node.clientHeight );
		console.log( s.attr( 'viewBox' ).width );
		setSnap( s );
	}, [svgRef] );

	useEffect( () => {
		if ( snap ) {
			// loadSymbols();
			loadSymbols( snap, symbols, scale ).then( values => {
				console.log( 'done!' );
				console.log( values );
				applyMasks( values );
			});
		}
	}, [snap] );

	const applyMasks = ( items ) => {
		// / just to test something out

		items.forEach( item => {
			if ( !item.masks || item.masks.length === 0 ) {
				return;
			}

			// if has masks ..
			const itemToApplyMask = snap.select( `#${item.id}` );
			const m = snap.select( `#${item.id}` );

			// create mask group with white background and black copies of each element that needs to be used as mask
			const maskGroup = snap.g().attr({ id: `${item.id}SymbolMask` });

			const rectSize = snap.attr( 'viewBox' ).width;

			maskGroup.append( snap.rect( 0, 0, rectSize, rectSize ).attr({ fill: '#ffffff' }) );

			item.masks.forEach( mask => {
				console.log( 'mask for ', item.id, '->', mask );

				const maskProperties = symbols.find( item => item.id === mask );
				const maskProperties2 = snap.select( `#${mask}` ).attr();
				// maskProperties2Filtered: maskProperties2.filter( prop =>  )

				const disallowedProps = ['href', 'id'];

				// const maskProperties3 = Object.entries( maskProperties2 ).filter( ( [key, value] ) => !['id', 'href'].includes( key ) );
				const maskProperties3 = Object.keys( maskProperties2 )
					.filter( key => !disallowedProps.includes( key ) )
					.reduce( ( obj, key ) => {
						obj[key] = maskProperties2[key];
						return obj;
					}, {});

				console.log({
					maskProperties: maskProperties.attributes,
					maskProperties2,
					maskProperties3
				});

				// maskPrpoprtiesFiltered: maskProperties.attributes

				const maskItem = snap.use( `#${mask}Symbol` );
				maskItem.attr({
					...maskProperties.attributes,
					fill: 'black',
					stroke: 'black',
					strokeWidth: 10
				});
				maskItem.transform( 't' + maskProperties.translate.join( ',' ) );
				maskItem.appendTo( maskGroup );

				// console.log( 'attributes', maskItem.attr() );
				// console.log( 'attributes2', snap.select( `#${item.id}` ).attr() );
			});

			// apply transform

			const newTranslate = `-${m.transform().localMatrix.e}, -${m.transform().localMatrix.f}`;

			maskGroup.transform( `t${newTranslate}` );
			itemToApplyMask.attr({ mask: maskGroup });

			console.log( '---' );
		});
	};

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
