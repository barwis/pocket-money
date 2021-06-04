import React, { useRef, useEffect, useState } from 'react';
import Snap from 'snapsvg';
import './style.css';

const SvgIcon = () => {
	const [ mySnap, setSnap] = useState( null );
	const svgRef = useRef( null );
	const [ symbolsArray, setSymbolsArray] = useState( [] );

	useEffect( () => {
		console.log( 'svgref updated!', svgRef.current.id );
		const s = Snap( `#${svgRef.current.id}` );
		setSnap( s );
	}, [svgRef] );

	useEffect( () => {
		console.log( 'snap set!', mySnap );
		if ( mySnap ) {
			loadSymbols();
		}
	}, [mySnap] );

	const symbols = [
		{
			symbolId: 'sunSymbol',
			symbolUrl: '/weather/64x64/day/svg/defs/sun.svg',
			attributes: {
				fill: 'none',
				stroke: '#F1C413',
				class: 'fadeIn',
				width: 35,
				height: 35
			},
			mask: '#cloudSymbol_mask',
			transform: 't5, 10'
		},
		{
			symbolId: 'cloudSymbol',
			maskId: 'cloudSymbol_mask',
			symbolUrl: '/weather/64x64/day/svg/defs/cloud.svg',
			attributes: {
				fill: 'none',
				stroke: '#3996D2',
				class: 'fadeIn',
				width: 44,
				height: 28
			},
			transform: 't12, 17'
		}
	];

	// transform: 't4, 9',

	const loadSymbols = () => {
		symbols.forEach( symbol => {
			const { symbolId, symbolUrl, attributes, transform, maskId, mask } = symbol;

			snapLoadPromise( symbolUrl ).then( data => {
				console.log( 'symbolId', `#${symbolId}` );
				const symbol = data.select( `#${symbolId}` );
				symbol.appendTo( mySnap ).toDefs();
				const useTag = mySnap.use().attr({
					href: `#${symbolId}`,
					...attributes
				})
					.transform( transform )
					.appendTo( mySnap );

				// create mask

				if ( maskId ) {
					const maskGroup = mySnap.symbol();
					const black = mySnap.g().attr({
						...attributes,
						id: `#${maskId}`,
						fill: 'black',
						stroke: 'black'
					})
						.transform( transform );
					black.append( mySnap.rect( 0, 0, 64, 64 ).attr({ fill: 'white' }) );
					black.appendTo( maskGroup );
					maskGroup.appendTo( mySnap ).toDefs();
				}
				if ( mask ) {
					// console.log( 'apply mask' );
					// useTag.attr({ mask: mySnap.use( mask ) });
				}

				// create mask of it
			});
		});

		console.log( 'symbolsArray', symbolsArray );
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

	// laod each symbol
	// add it to symbols
	// add element to scene
	// create its mask

	return (
		<div>
			{/* <img src="/weather/64x64/day/svg/116.svg" style={{
				position: 'absolute',
				left: '50%',
				transform: 'translateX(-50%)',
				width: 64
			}}/> */}
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
