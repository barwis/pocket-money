import React, { useRef, useEffect, useState } from 'react';

import './style.css';
import {
	_diff,
	getAttributes,
	getPosition,
	getSvgScale,
	processParam,
	setAttributes,
	stringToMiliseconds
	// SymbolLoader

} from '../utils/svgUtils';

const SvgIcon = () => {
	const [ svg, setSvg] = useState( null );
	const [ scale, setScale ] = useState( 1 );
	const [ defs, setDefs ] = useState( null );
	const svgRef = useRef( null );
	// const svgProps = {};
	const useIdPrefix = 'use_';
	const maskIdPrefix = 'mask_';

	// const loadSymbols = async ( symbols ) => {
	// 	const sl = new SymbolLoader();

	// 	for ( const symbol of symbols ) {
	// 		const data = await sl.loadSymbolFromFile( symbol );
	// 		console.log( 'symbol loaded', symbol.url );
	// 		console.log( data );
	// 	}

	// 	console.log( sl.symbols );
	// };

	useEffect( () => {
		const svg = document.getElementById( svgRef.current.id );

		setSvg( svg );
		// setViewBox( vb );
		let d;

		// defs
		try {
			d = Array.from( document.getElementsByTagName( 'defs' ) )[0];
		} catch {
			console.log( 'cant find defs' );
			return false;
		}
		setDefs( d );

		const myscale = getSvgScale( svg );
		setScale( myscale );

		const symbols = [
			{
				url: '/weather/64x64/day/svg/defs/symbols.svg',
				symbol: '#cloud-small'
			},
			{
				url: '/weather/64x64/day/svg/defs/symbols.svg',
				symbol: '#cloud-big'
			}

		];

		// loadSymbols( symbols );
	}, [svgRef] );

	useEffect( () => {
		if ( defs ) {
			adjustAnimationsDelays();
			adjustAnimations();
			createMasks();
			// cleanup();
		}
	}, [defs] );

	const adjustAnimationsDelays = () => {
		const elems = document.querySelectorAll( '[animation-delay]' );
		if ( elems.length === 0 ) {
			return;
		}

		// 1. foreach <use> with animation-delay property...
		elems.forEach( elem => {
			const { animationDelay: delay, animationDuration: duration } = getAttributes( elem, ['animation-delay', 'animation-duration'], stringToMiliseconds );

			// get its symbol

			const { id: useId, href: usedSymbolId } = getAttributes( elem, ['id', 'href'] );

			const usedSymbol = defs.querySelector( `${usedSymbolId}` );

			// clone its symbol
			const clonedUsedSymbol = usedSymbol.cloneNode( true );

			defs.appendChild( clonedUsedSymbol );

			// 2.5 generate symbol new id
			const newId = useId + '--' + usedSymbol.getAttribute( 'id' );
			clonedUsedSymbol.setAttribute( 'id', newId );

			// 3. adjust cloned symbol animation delays
			const animateTags = Array.from( defs.querySelectorAll( `#${newId} animate` ) ) || [];
			animateTags.forEach( tag => {
				const { begin, dur } = getAttributes( tag, ['begin', 'dur'] );

				if ( begin && delay ) {
					const finalDelay = ( stringToMiliseconds( begin ) + delay ) / 1000 + 's';
					tag.setAttribute( 'begin', finalDelay );
				}
				if ( dur && duration ) {
					const finalDuration = ( stringToMiliseconds( dur ) + duration ) / 1000 + 's';
					tag.setAttribute( 'dur', finalDuration );
				}
			});

			elem.setAttribute( 'href', `#${newId}` );
		});
	};

	const adjustAnimations = () => {
		// animate
		const animatedPath = document.querySelectorAll( 'animate[attributeName="stroke-dashoffset"]' );

		animatedPath.forEach( node => {
			const pathNode = node.parentNode;
			const animateNode = node;

			const baseValues = {
				pathLength: Math.ceil( pathNode.getTotalLength() ),
				dashLength: parseInt( pathNode.getAttribute( 'stroke-dash-width' ) ) || 2
			};

			// TODO: refactor this?
			const scaledValues = {};

			// TODO: adjust animations based on <use> transform scale
			Object.entries( baseValues ).map( ( [key, value] ) => {
				scaledValues[key] = value * scale;
			});

			const { pathLength, dashLength } = scaledValues;

			const from = dashLength + dashLength + pathLength;
			const to = dashLength;

			const pathTagAttributes = {
				strokeDasharray: `${dashLength}, ${pathLength}`,
				strokeDashoffset: from
			};
			const animateTagAttributes = {
				from,
				to
			};

			setAttributes( pathNode, pathTagAttributes );
			setAttributes( animateNode, animateTagAttributes );
		});
	};

	const createMasks = () => {
		const itemsWithMasks = document.querySelectorAll( '[data-masks]' );

		itemsWithMasks.forEach( item => {
			const masks = processParam( item.dataset.masks );
			createMask( item, masks );
		});
	};

	const createMask = ( item, masks ) => {
		const itemId = item.getAttribute( 'id' );
		const itemToMask = document.getElementById( itemId );
		const svgns = 'http://www.w3.org/2000/svg';

		const maskGroupId = itemId.replace( useIdPrefix, maskIdPrefix );

		const maskGroup2 = document.createElementNS( svgns, 'mask' );
		maskGroup2.setAttribute( 'id', maskGroupId + 'asd' );
		defs.appendChild( maskGroup2 );

		const itemXY = getPosition( item );
		if ( !itemXY ) {
			console.log( 'couldn\'t get item position' );
			return;
		}

		let whiteRect = document.createElementNS( svgns, 'rect' );

		const attributes = {
			x: 0,
			y: 0,
			width: 64,
			height: 64,
			fill: '#ffffff'
		};
		setAttributes( whiteRect, attributes );

		maskGroup2.appendChild( whiteRect );

		masks.forEach( mask => {
			const selector = `${useIdPrefix}${mask}`;
			let useCopy;
			try {
				useCopy = document.getElementById( selector ).cloneNode();
			} catch ( e ) {
				console.warn( e );
				return;
			}

			const maskXY = getPosition( useCopy );
			const diffXY = _diff( maskXY, itemXY );

			useCopy.removeAttribute( 'data-masks' );
			useCopy.removeAttribute( 'mask' );
			useCopy.removeAttribute( 'id' );
			useCopy.classList.add( 'mask' );
			setAttributes( useCopy, diffXY );
			maskGroup2.append( useCopy );
		});

		itemToMask.setAttribute( 'mask', `url(#${maskGroupId}asd)` );

		// snapItem.attr({ mask: `url(#${maskGroupId})` });
	};

	return (
		<div>
			<svg
				ref={svgRef}
				id="svg"
				width="112"
				height="112"
				version="1.1"
				viewBox="0 0 64 64"
				xmlns="http://www.w3.org/2000/svg"
				className="noscale"
				style={{
					position: 'absolute',
					display: 'block',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}}
			>
				<defs>
					<symbol id="cloud-big" viewBox="0 0 43 27.73">
						<path vectorEffect="non-scaling-stroke"
							d=" M 37.678 13.447 C 40.495 14.468 42.511 17.065 42.5 20.101 C 42.5 24.044 39.158 27.233 35.034 27.233 L 7.031 27.233 C 3.422 27.233 0.5 24.445 0.5 20.999 C 0.5 17.848 2.944 15.261 6.124 14.831 C 6.334 10.821 9.79 7.632 14.039 7.632 C 14.459 7.632 14.86 7.67 15.261 7.728 C 16.922 3.508 21.171 0.5 26.174 0.5 C 32.618 0.5 37.841 5.493 37.841 11.642 C 37.841 12.263 37.783 12.855 37.678 13.447 L 37.678 13.447 Z " />
					</symbol>

					<symbol id="cloud-small" viewBox="0 0 43 27.73">
						<path vectorEffect="non-scaling-stroke"
							d="M5.3,13.4c-0.1-0.6-0.2-1.2-0.2-1.8c0-6.1,5.2-11.1,11.7-11.1 c5,0,9.3,3,10.9,7.2c0.4-0.1,0.8-0.1,1.2-0.1c4.2,0,7.7,3.2,7.9,7.2c3.2,0.4,5.6,3,5.6,6.2c0,3.4-2.9,6.2-6.5,6.2H8 c-4.1,0-7.5-3.2-7.5-7.1C0.5,17.1,2.5,14.5,5.3,13.4L5.3,13.4z" />
					</symbol>

					<symbol id="sun" viewBox="0 0 36 36">
						<g transform-origin="center center" id="sunUse">
							<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="30s"
								repeatCount="indefinite" />

							<circle id="sun_orb" cx="18" cy="18" r="9" />
							<g transform-origin="center">
								<g transform-origin="center" transform="rotate(0)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="0s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(30)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="-1s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(60)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="0s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(90)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="-1s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(120)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="0s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(150)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="-1s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(180)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="0s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(210)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="-1s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(240)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="0s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(270)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="-1s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(300)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="0s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
								<g transform-origin="center" transform="rotate(330)">
									<line transform="translate(30 18)" x1="0"
										y1="0" x2="5" y2="0">
										<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1; .2 1; 1 1"
											begin="-1s" dur="2s" repeatCount="indefinite" />
									</line>
								</g>
							</g>
						</g>
					</symbol>
					<symbol id="rain" viewBox="0 0 27 22" >
						<path stroke-dash-width="3" d="M17,0.8c-2.1,6-4.1,11.7-6.1,17.6">
							<animate attributeName="stroke-dashoffset" begin="0s" dur="0.7s" repeatCount="indefinite" />
						</path>
						<path stroke-dash-width="3" d="M10.8,18.4c0,0-2.8-5.1-8.8-2.9">
							<animate attributeName="stroke-dashoffset" begin=".6s" dur="0.7s" repeatCount="indefinite" />
							<animate attributeName="opacity" from="1.2" to="0" begin="0.6s" dur="0.7s" repeatCount="indefinite" />

						</path>
						<path stroke-dash-width="1" d="M11,19c0,0,4.9-3.3,7.7,1.7">
							<animate attributeName="stroke-dashoffset" begin=".6s" dur="0.7s" repeatCount="indefinite" />
							<animate attributeName="opacity" from="1.2" to="0" begin="0.6s" dur="0.7s" repeatCount="indefinite" />
						</path>
						<path stroke-dash-width="1" d="M11,19c0,0-5-3-9,2">
							<animate attributeName="stroke-dashoffset" begin=".6s" dur="0.7s" repeatCount="indefinite" />
							<animate attributeName="opacity" from="1.2" to="0" begin="0.6s" dur="0.7s" repeatCount="indefinite" />
						</path>
						<path stroke-dash-width="1" d="M11,19c0,0,4.8-5.7,10.5-2">
							<animate attributeName="stroke-dashoffset" begin=".6s" dur="0.7s" repeatCount="indefinite" />
							<animate attributeName="opacity" from="1.2" to="0" begin="0.6s" dur="0.7s" repeatCount="indefinite" />
						</path>
					</symbol>
					<symbol id="fog" viewBox="0 0 55 3">
						<path stroke-dash-width="30" d="M0.5,0.99c2.45,0,2.45,1,4.91,1c2.45,0,2.45-1,4.9-1c2.45,0,2.45,1,4.91,1c2.45,0,2.45-1,4.91-1 c2.45,0,2.45,1,4.91,1c2.45,0,2.45-1,4.91-1c2.45,0,2.45,1,4.91,1c2.45,0,2.45-1,4.91-1c2.46,0,2.46,1,4.91,1c2.46,0,2.46-1,4.91-1 s2.46,1,4.91,1">
						</path>
					</symbol>
				</defs>
				{/* <rect x="0" y="0" width="64" height="64" fill="rgba(255, 255, 255, 0.05)" stroke="none"/> */}
				<use id="use_cloud-small" width="25" height="20" x="8" y="18" href="#cloud-small" className="cloud outline" data-masks="['cloud-big', 'sun']"/>
				<use id="use_cloud-big" width="44" height="28" x="12" y="17" href="#cloud-big" className="cloud outline" data-masks="['rain-1', 'rain-2', 'rain-3', 'rain-4']"/>

				<use id="use_rain-1" href="#rain" className="rain rain-1 outline" x="5" y="37" width="27" height="22" animation-delay="0.0s" />
				<use id="use_rain-2" href="#rain" className="rain rain-2 outline" x="13" y="35" width="27" height="22" animation-delay="0.35s"/>
				<use id="use_rain-3" href="#rain" className="rain rain-3 outline" x="22" y="38" width="27" height="22" animation-delay="0.17s" />
				<use id="use_rain-4" href="#rain" className="rain rain-4 outline" x="33" y="36" width="27" height="22" animation-delay="0.5s" />
				{/* <use id="use_fog" href="#fog" className="fog outline" x="0" y="0" width="55" height="3" /> */}

			</svg>
		</div>
	);
};

export default SvgIcon;
