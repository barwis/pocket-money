import React, { useRef, useEffect, useState } from 'react';
import Snap from 'snapsvg';
import AnimateStroke from '../utils/strokeAnimate';
import './style.css';

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
			loadSymbols();
		}
	}, [snap] );

	const symbols = [
		{
			id: 'cloud3',
			symbolRef: 'cloudFlippedSymbol',
			symbolUrl: '/weather/64x64/day/svg/defs/cloud.svg',
			attributes: {
				fill: 'none',
				stroke: '#3996D2',
				width: 25,
				height: 20
			},
			masks: ['sun', 'cloud2'],
			translate: [8, 20]
		},
		{
			id: 'sun',
			symbolRef: 'sunSymbol',
			symbolUrl: '/weather/64x64/day/svg/defs/sun.svg',
			attributes: {
				fill: 'none',
				stroke: '#F1C413',
				width: 29,
				height: 29
			},
			masks: ['cloud2'],
			translate: [11, 12]
		},
		{
			id: 'cloud2',
			symbolRef: 'cloudSymbol',
			symbolUrl: '/weather/64x64/day/svg/defs/cloud.svg',
			attributes: {
				fill: 'none',
				stroke: '#3996D2',
				width: 44,
				height: 28
			},
			translate: [12, 17]
		},
		{
			id: 'rain',
			symbolRef: 'rainSymbol',
			symbolUrl: '/weather/64x64/day/svg/defs/rain.svg',
			attributes: {
				fill: 'none',
				stroke: 'black',
				width: 27,
				height: 22
			},
			transformOrigin: [11, 0],
			translate: [25, 35],
			rotate: 20
		},
		{
			id: 'rain2asd',
			symbolRef: 'rainSymbol2',
			symbolUrl: '/weather/64x64/day/svg/defs/rain.svg',
			attributes: {
				fill: 'none',
				stroke: 'black',
				width: 27,
				height: 22
			},
			transformOrigin: [11, 0],
			translate: [35, 35],
			rotate: 20
		}

	];

	const loadSymbols = () => {
		snap.clear();
		// const css = window.document.styleSheets[0];

		const promises = [];

		symbols.forEach( symbol => {
			const { id, symbolRef, symbolUrl, attributes, transformOrigin, translate, rotate, masks } = symbol;

			const p = snapLoadPromise( symbolUrl ).then( data => {
				const symbol = data.select( `#${symbolRef}` );
				symbol.attr({ id: `${id}Symbol` });
				symbol.appendTo( snap ).toDefs();

				const use = snap.use().attr({
					id: `${id}`,
					href: `#${id}Symbol`,
					transformOrigin: [0, 5],
					...attributes
				})
					// .transform( 't' + transform.join( ',' ) )
					.appendTo( snap );

				// m.applyToContext( use );
				var myMatrix = new Snap.Matrix();
				if ( transformOrigin ) {
					use.attr( 'transform-origin', transformOrigin.join( ' ' ) );
				}
				if ( translate ) {
					myMatrix.translate( translate[0], translate[1] );
				}
				if ( rotate ) {
					myMatrix.rotate( rotate );
				}

				use.transform( myMatrix );

				const p = snap.select( `#${id}Symbol .animate` );
				if ( p ) {
					// console.log( p );
					// animateStroke( p, scale, 3 );
					// p.attr({ 'style': 'stroke: red' });
					const anim = new AnimateStroke( p, scale, 3 );
					console.log( 'scaled?', anim.isScaled );
					console.log( 'strokeDashOffset', anim.strokeDashOffset );
					console.log( 'strokeDashArray', anim.strokeDashArray );
					console.log( anim.calculate() );
					anim.apply();
				}
				// if ( p ) {
				// 	console.log( p );
				// 	p.animate({ x: 50 }, 500 );
				// }

				// rain animation
				// var offset = 0;
				// var animation = function () {
				// 	offset -= 20;
				// 	path.animate({ x: 20 }, 500, mina.linear );
				// };

				return {
					id,
					masks
				};
			});

			promises.push( p );
		});

		// apply masks
		Promise.all( promises ).then( ( values ) => {
			applyMasks( values );
		});
	};

	const applyMasks = ( items ) => {
		items.forEach( item => {
			if ( !item.masks || item.masks.length === 0 ) {
				return;
			}

			// if has masks ..
			const itemToApplyMask = snap.select( `#${item.id}` );

			// create mask group with white background and black copies of each element that needs to be used as mask
			const maskGroup = snap.g().attr({ id: `${item.id}SymbolMask` });

			maskGroup.append( snap.rect( 0, 0, 64, 64 ).attr({ fill: '#fafafa' }) );
			// maskGroup.toDefs();

			item.masks.forEach( mask => {
				const maskProperties = symbols.find( item => item.id === mask );
				const maskItem = snap.use( `#${mask}Symbol` );
				maskItem.attr({
					...maskProperties.attributes,
					fill: 'black',
					stroke: 'black'
					// strokeWidth: 6
				});
				maskItem.transform( 't' + maskProperties.translate.join( ',' ) );
				maskItem.appendTo( maskGroup );
			});

			// apply transform

			const current = symbols.find( s => s.id === item.id );
			const maskGroupTransform = current.translate.map( item => -item ).join( ', ' );
			maskGroup.transform( `t${maskGroupTransform}` );

			itemToApplyMask.attr({ mask: maskGroup });
		});
	};

	const snapLoadPromise = ( url ) => {
		return new Promise( ( resolve, reject ) => {
			try {
				Snap.load( url, function ( data ) {
					resolve( data );
				});
			} catch ( e ) {
				reject( new Error( e ) );
			}
		});
	};

	return (
		<div>
			<svg
				ref={svgRef}
				id="svg"
				width="256"
				height="256px"
				version="1.1"
				viewBox="0 0 64 64"
				xmlns="http://www.w3.org/2000/svg"
			/>
		</div>
	);
};

export default SvgIcon;
