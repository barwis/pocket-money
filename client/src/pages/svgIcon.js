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
			transform: [8, 20]
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
			transform: [11, 12]
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
			transform: [12, 17]
		}
	];

	const loadSymbols = () => {
		snap.clear();

		const promises = [];

		symbols.forEach( symbol => {
			const { id, symbolRef, symbolUrl, attributes, transform, masks } = symbol;

			const p = snapLoadPromise( symbolUrl ).then( data => {
				const symbol = data.select( `#${symbolRef}` );
				symbol.attr({ id: `${id}Symbol` });
				symbol.appendTo( snap ).toDefs();

				snap.use().attr({
					id: `${id}`,
					href: `#${id}Symbol`,
					...attributes
				})
					.transform( 't' + transform.join( ',' ) )
					.appendTo( snap );

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
					stroke: 'black',
					strokeWidth: 6
				});
				maskItem.transform( 't' + maskProperties.transform.join( ',' ) );
				maskItem.appendTo( maskGroup );
			});

			// apply transform

			const current = symbols.find( s => s.id === item.id );
			const maskGroupTransform = current.transform.map( item => -item ).join( ', ' );
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
				width="256px"
				height="256px"
				version="1.1"
				viewBox="0 0 64 64"
				xmlns="http://www.w3.org/2000/svg"
				style={{
					margin: '0 auto',
					display: 'block',
					strokeWidth: '2px',
					outline: '1px solid white'
				}}
			/>
		</div>
	);
};

export default SvgIcon;
