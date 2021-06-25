import React, { useRef, useEffect, useState } from 'react';
import Snap, { animate } from 'snapsvg';
// import symbols, { items } from './symbols';
// import { Icon } from '../utils/strokeAnimate';
import './style.css';
import {
	_diff,
	getPosition,
	getScale,
	processParam,
	// setAttributes,
	// stringToArray,
	stringToMiliseconds
} from '../utils/svgUtils';

const SvgIcon = () => {
	const [ snap, setSnap] = useState( null );
	const svgRef = useRef( null );
	// const svgProps = {};
	const useIdPrefix = 'use_';
	const maskIdPrefix = 'mask_';
	const generatedMasks = [];

	useEffect( () => {
		const s = Snap( `#${svgRef.current.id}` );

		setSnap( s );
		window.snap = s;
	}, [svgRef] );

	useEffect( () => {
		if ( snap ) {
			adjustAnimationsDelays();
			adjustAnimations();
			createMasks();
			cleanup();
			// setTimeout( () => { console.log( snap.toString() ); }, 1000 );
		}
	}, [snap] );

	const cleanup = () => {
		const defSymbols = snap.selectAll( 'defs symbol' );
		console.log( defSymbols );

		defSymbols.forEach( symbol => {
			const symbolId = symbol.attr( 'id' );

			const uses = snap.select( `[href="#${symbolId}"]` );

			// eslint-disable-next-line
			if ( !uses ) {
				symbol.remove();
				console.log( symbol );
			}
		});
	};
	const adjustAnimationsDelays = () => {
		const elems = document.querySelectorAll( '[animation-delay]' );

		// 1. foreach <use> with animation-delay property...
		elems.forEach( elem => {
			const delay = stringToMiliseconds( elem.getAttribute( 'animation-delay' ) );
			const duration = stringToMiliseconds( elem.getAttribute( 'animation-duration' ) );

			// 2.0 get its symbol
			const useId = elem.getAttribute( 'id' );
			const usedSymbolId = elem.getAttribute( 'href' );
			const usedSymbol = snap.select( `defs ${usedSymbolId}` );

			// 2.1 clone its symbol
			const clonedUsedSymbol = usedSymbol.clone();

			// 2.5 generate symbol new id
			const newId = useId + '--' + usedSymbol.attr( 'id' );
			clonedUsedSymbol.attr({ id: newId });

			// 3. adjust cloned symbol animation delays
			const animateTags = Array.from( clonedUsedSymbol.selectAll( 'animate' ) ) || false;
			if ( animateTags ) {
				animateTags.forEach( tag => {
					const ownDelay = stringToMiliseconds( tag.attr( 'begin' ) || '0' );
					const ownDuration = stringToMiliseconds( tag.attr( 'dur' ) || '0' );
					const finalDelay = ( ownDelay + delay ) / 1000 + 's';
					const finalDuration = ( ownDuration + duration ) / 1000 + 's';

					if ( tag.attr( 'begin' ) ) {
						tag.attr({ 'begin': finalDelay });
					}
					if ( tag.attr( 'dur' ) ) {
						tag.attr({ 'dur': finalDuration });
					}
				});
			}
			elem.setAttribute( 'href', `#${newId}` );
		});
	};

	const adjustAnimations = () => {
		// animate

		const animatedPath = document.querySelectorAll( 'animate[attributeName="stroke-dashoffset"]' );

		animatedPath.forEach( node => {
			const pathNode = node.parentNode;
			const animateNode = node;
			const scale = getScale( snap );

			const baseValues = {
				pathLength: Math.ceil( pathNode.getTotalLength() ),
				dashLength: parseInt( pathNode.getAttribute( 'stroke-dash-width' ) ) || 2
			};

			const scaledValues = {};

			Object.entries( baseValues ).map( ( [key, value] ) => {
				scaledValues[key] = value * scale;
			});

			const { pathLength, dashLength } = scaledValues;

			const from = dashLength + dashLength + pathLength;
			const to = dashLength;
			const path = {
				strokeDasharray: `${dashLength}, ${pathLength}`,
				strokeDashoffset: from
			};
			const animate = {
				from,
				to
			};

			pathNode.setAttribute( 'stroke-dasharray', path.strokeDasharray );
			pathNode.setAttribute( 'stroke-dashoffset', path.strokeDashoffset );

			animateNode.setAttribute( 'from', animate.from );
			animateNode.setAttribute( 'to', animate.to );
		});
	};

	const createMasks = () => {
		if ( snap ) {
			const itemsWithMasks = document.querySelectorAll( '[data-masks]' );

			itemsWithMasks.forEach( item => {
				const masks = processParam( item.dataset.masks );
				createMask( item, masks );
			});
		}
	};

	const createMask = ( item, masks ) => {
		if ( snap ) {
			const itemId = item.getAttribute( 'id' );
			const snapItem = snap.select( `#${itemId}` );

			const maskGroupId = itemId.replace( useIdPrefix, maskIdPrefix );
			const maskGroup = snap
				.mask()
				.appendTo( snap )
				.toDefs();

			maskGroup.attr({ id: maskGroupId });

			const itemXY = getPosition( item );
			if ( !itemXY ) {
				console.log( 'couldn\'t get item position' );
				return;
			}

			snap
				.rect( 0, 0, 64, 64 )
				.attr({ fill: 'white' })
				.appendTo( maskGroup );

			// for each mask copy...
			masks.forEach( mask => {
				const selector = `#${useIdPrefix}${mask}`;
				let useCopy;

				try {
					useCopy = snap.select( selector ).clone();
				} catch {
					console.warn( 'can\'t locate mask', selector );
					return;
				}

				const maskXY = getPosition( useCopy );
				const diffXY = _diff( maskXY, itemXY );

				useCopy
					.addClass( 'mask' )
					.attr({
						'data-masks': null,
						'mask': 'nothing',
						...diffXY
					})
					.appendTo( maskGroup );
			});

			snapItem.attr({ mask: Snap.url( maskGroupId ) });
		}
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

				</defs>
				{/* <rect x="0" y="0" width="64" height="64" fill="rgba(255, 255, 255, 0.05)" stroke="none"/> */}
				<use id="use_cloud-small" width="25" height="20" x="8" y="20" href="#cloud-small" className="cloud" data-masks="['cloud-big', 'sun']"/>
				<use id="use_sun" width="29" height="29" x="11" y="12" href="#sun" className="sun" data-masks="['cloud-big']" />
				<use id="use_cloud-big" width="44" height="28" x="12" y="17" href="#cloud-big" className="cloud" data-masks="['rain-1', 'rain-2', 'rain-3', 'rain-4']"/>

				<use id="use_rain-1" href="#rain" className="rain rain-1 outline" x="5" y="37" width="27" height="22" animation-delay="0.0s" />
				<use id="use_rain-2" href="#rain" className="rain rain-2 outline" x="13" y="35" width="27" height="22" animation-delay="0.35s"/>
				<use id="use_rain-3" href="#rain" className="rain rain-3 outline" x="22" y="38" width="27" height="22" animation-delay="0.17s" />
				<use id="use_rain-4" href="#rain" className="rain rain-4 outline" x="33" y="36" width="27" height="22" animation-delay="0.5s" />

			</svg>
		</div>
	);
};

export default SvgIcon;
