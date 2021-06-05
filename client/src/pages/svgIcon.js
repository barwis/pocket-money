import React, { useRef, useEffect, useState } from 'react';
import Snap from 'snapsvg';
import './style.css';

const SvgIcon = () => {
	const [ snap, setSnap] = useState( null );
	const svgRef = useRef( null );

	useEffect( () => {
		const s = Snap( `#${svgRef.current.id}` );
		setSnap( s );
	}, [svgRef] );

	useEffect( () => {
		if ( snap ) {
			loadSymbols();
		}
	}, [snap] );

	const symbols = [
		{
			symbolId: 'sunSymbol',
			symbolUrl: '/weather/64x64/day/svg/defs/sun.svg',
			attributes: {
				fill: 'none',
				stroke: '#F1C413',
				width: 35,
				height: 35
			},
			mask: 'cloudSymbolMask',
			masks: ['cloudSymbol'],
			transform: [5, 10]
		},
		{
			symbolId: 'cloudSymbol',
			maskId: 'cloudSymbolMask',
			symbolUrl: '/weather/64x64/day/svg/defs/cloud.svg',
			attributes: {
				fill: 'none',
				stroke: '#3996D2',
				width: 44,
				height: 28
			},
			transform: [12, 17]

		}
	];

	const loadSymbols = () => {
		snap.clear();

		const promises = [];

		symbols.forEach( symbol => {
			const { symbolId, symbolUrl, attributes, transform, maskId, mask } = symbol;

			const p = snapLoadPromise( symbolUrl ).then( data => {
				const symbol = data.select( `#${symbolId}` );
				symbol.appendTo( snap ).toDefs();
				const useTag = snap.use().attr({
					href: `#${symbolId}`,
					...attributes
				})
					.transform( 't' + transform.join( ',' ) )
					.appendTo( snap );

				// create mask
				if ( maskId ) {
					const maskSymbol = snap.symbol().attr({ id: `${maskId}` });
					// const maskGroup = snap.g();
					maskSymbol.append( snap.rect( 0, 0, 64, 64 ).attr({ fill: '#fafafa' }) );
					const clone = useTag.clone();
					clone.attr({
						id: 'use',
						fill: 'black',
						stroke: 'black'
					}).transform( 't5, 10' );

					maskSymbol.append( clone );
					maskSymbol.appendTo( snap ).toDefs();
				} else {
					// console.log( 'useTag', useTag );
					// useTag.attr({ class: 'fadeIn' });
				}

				if ( !mask ) {
					useTag.attr({ class: 'fadeIn' });
				} else {
					// useTag.attr({ class: 'hidden' });
				}

				return {
					symbolId,
					mask,
					maskId,
					transform
				};
			});

			promises.push( p );
			return p;
		});

		// apply masks
		Promise.all( promises ).then( ( values ) => {
			applyMasks( values );
		});
	};

	const applyMasks = ( items ) => {
		items.forEach( item => {
			if ( !item.mask ) {
				return;
			}

			const element = snap.select( `#${item.symbolId}` );
			const mask = snap.select( `#${item.mask}` );

			// console.log( item, mask.toString() );
			console.log( mask.toString() );
			mask.transform( 't5, 5' );
			console.log( mask.toString() );

			// item:
			// mask: "cloudSymbolMask"
			// symbolId: "sunSymbol"
			// transform: (2) [5, 10]

			mask.transform( 't' + item.transform.join( ', ' ) );

			element.attr({
				mask: snap.use( `#${item.mask}` ),
				class: 'fadeIn'
			});
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
				width="64px"
				height="64px"
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
