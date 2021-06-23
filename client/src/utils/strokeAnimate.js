import Snap from 'snapsvg';

const mergeProps = ( obj1, obj2 ) => {
	const finalObj = {};
	// console.log( 'merging', obj1, obj2 );
	if ( obj1 ) {
		Object.entries( obj1 ).forEach( ( [key, val] ) => {
			if ( typeof val === 'number' ) {
				finalObj[key] = finalObj[key] ? finalObj[key] + val : val;
			} else {
				finalObj[key] = finalObj[key] ? mergeProps( val, finalObj[key] ) : val;
			}
		});
	}
	if ( obj2 ) {
		Object.entries( obj2 ).forEach( ( [key, val] ) => {
			if ( typeof val === 'number' ) {
				finalObj[key] = finalObj[key] ? finalObj[key] + val : val;
			} else {
				finalObj[key] = finalObj[key] ? mergeProps( val, finalObj[key] ) : val;
			}
		});
	}
	return finalObj;
};

class AnimateStroke {
	constructor ( path, scale, strokeWidth, timing ) {
		this.path = path;

		this.scale = path.attr( 'vector-effect' ) === null ? 1 : scale;
		this.strokeWidth = strokeWidth * this.scale;
		// console.log( this.strokeWidth );

		const t = {
			duration: 500,
			iterations: Infinity,
			delay: 0
		};

		this.timing = {
			...t,
			...timing.timing
		};

		this.pathLength = Math.ceil( this.path.getTotalLength() ) * this.scale;

		if ( this.delay ) {
			this.timing.delay += this.timing.duration * 0.8;
		}

		this.defaultStyles = {
			strokeDashoffset: this.strokeWidth,
			strokeDasharray: [this.strokeWidth, this.pathLength]
		};
	}

	get getDefaultStyles () {
		return this.defaultStyles;
	}

	// get length () {
	// 	return this.isScaled ? this.pathLength * this.scale : this.pathLength;
	// }

	get strokeDashOffset () {
		const defaultStrokeDashOffset = this.defaultStyles.strokeDashoffset;
		return defaultStrokeDashOffset * this.scale;
	}

	get strokeDashArray () {
		const defaultStrokeDashArray = this.defaultStyles.strokeDasharray;
		return defaultStrokeDashArray.map( item => item * this.scale ).join( ', ' );
	}

	calculate () {
		return {
			'stroke-dashoffset': this.strokeDashOffset,
			'stroke-dasharray': this.strokeDashArray
		};
	}

	apply () {
		const animKeyframes = [
			{ strokeDashoffset: this.strokeDashOffset + this.strokeDashOffset + this.length },
			{ strokeDashoffset: this.strokeDashOffset }
		];

		const timing = this.timing;

		const props = {
			pathAttributes: {
				'stroke-dashoffset': this.strokeWidth + this.strokeWidth + this.pathLength,
				'stroke-dasharray': `${this.strokeWidth}, ${this.pathLength}`
			},
			animateAttributes: {
				attributeName: 'stroke-dashoffset',
				from: this.strokeWidth + this.strokeWidth + this.pathLength,
				to: this.strokeWidth
			}
		};

		const pathTag = this.path.node;
		const pathSelector = '.' + pathTag.className.baseVal.split( ' ' ).join( '.' );
		const pathElems = document.querySelectorAll( pathSelector );

		pathElems.forEach( elem => {
			Object.entries( props.pathAttributes ).forEach( ( [key, value] ) => {
				elem.setAttribute( key, value );
			});
		});

		// const animateTag = this.path.node.children[0];
		const animateSelector = [pathSelector, 'animate'].join( ' ' );
		const animateElems = document.querySelectorAll( animateSelector );

		animateElems.forEach( elem => {
			Object.entries( props.animateAttributes ).forEach( ( [key, value] ) => {
				elem.setAttribute( key, value );
			});
			// elem.setAttribute( 'stroke', 'blue' );
			// console.log( 'elem' );
		});

		// pathTag.setAttribute( 'stroke-width', 50 );
		// console.log( 'selector', animateSelector );
		// console.log( 'elems', animateElems );
		// const length = this.pathLength;
		// console.log({
		// 	length,
		// 	animKeyframes,
		// 	'stroke-dashoffset': this.strokeDashOffset,
		// 	'stroke-dasharray': this.strokeDashArray,
		// 	pathTag,
		// 	animateTag
		// });

		// this.path.node.animate(
		// 	animKeyframes,
		// 	timing
		// );
	}
};

class Icon {
	constructor ( snap ) {
		this.snap = snap;
		this.symbols = {};
		this.elements = {};
		this.scale = 1;
	}

	static snapLoadPromise ( url ) {
		return new Promise( ( resolve, reject ) => {
			try {
				Snap.load( url, function ( data ) {
					resolve( data );
				});
			} catch ( e ) {
				reject( new Error( e ) );
			}
		});
	}
	setScale ( s ) {
		this.scale = s;
	}

	getById ( id ) {
		return this.snap.select( id );
	}

	// TODO: fix transform-origin for rotations
	generateTransforms ( item, symbol ) {
		const { transformOrigin, translate, rotate, scale } = symbol;
		const myMatrix = new Snap.Matrix();

		if ( transformOrigin ) {
			item.attr( 'transform-origin', transformOrigin.join( ' ' ) );
		} else {
			item.attr( 'transform-origin', 'center center' );
		}

		if ( translate ) {
			myMatrix.translate( translate[0], translate[1] );
		}
		if ( rotate ) {
			myMatrix.rotate( rotate );
		}
		if ( scale ) {
			myMatrix.scale( scale );
		}

		item.transform( myMatrix );
	}

	svgSymbolToDefs ( svgData, id, symbolRef ) {
		const symbolId = `${id}Symbol`;
		try {
			const symbol = svgData.select( `#${symbolRef}` );
			symbol.attr({ id: symbolId });
			symbol.appendTo( this.snap ).toDefs();
			symbol.attr( 'data-id', id );
			return {
				id,
				symbolId
			};
		} catch ( e ) {
			return false;
		}
	}

	loadSymbol ( svgData, id, symbolRef ) {
		const symbolId = `${id}Symbol`;
		try {
			const symbol = svgData.select( `#${symbolRef}` );
			symbol.attr({ id: symbolId });

			this.symbols[id] = {
				element: symbol,
				symbolId,
				id,
				href: `#${id}`,
				useId: id
			};

			return symbol;
		} catch ( e ) {
			return false;
		}
	}

	createSymbol ( s ) {
		const { id, symbol, attributes, translate, animation, masks } = s;

		return snapLoadPromise( symbol.url ).then( data => {
			// load <symbol>
			const myDef = this.loadSymbol( data, id, symbol.ref );
			if ( !myDef ) {
				return;
			}
			this.symbols[id].attributes = attributes;
			this.symbols[id].translate = translate;
			this.symbols[id].animation = animation;
			this.symbols[id].masks = masks;

			// add <symbol> to svg <defs>

			myDef.appendTo( this.snap ).toDefs();
		});
	}

	async loadSymbols ( symbols ) {
		this.snap.clear();
		const promises = [];

		symbols.forEach( symbol => {
			const p = this.createSymbol( symbol );
			promises.push( p );
		});

		return Promise.all( promises );
	};

	loadlements ( elements ) {
		this.elements = elements;
		elements.forEach( element => {
			const { id, type: elementType, elements, translate, scale } = element;
			// console.log( id );
			// console.log( element );
			if ( elementType === 'symbol' ) {
				const symbol = this.symbols[element.id];
				this.symbolToElement( symbol );
			} else {
				const group = this.snap.g().appendTo( this.snap );
				group.attr({ id });

				this.generateTransforms( group, {
					translate,
					scale
				});
				// }
				elements?.forEach( element => {
					const symbol = this.symbols[element];

					this.symbolToElement( symbol, group );
				});
			}
		});
	}

	loadMasks ( elements ) {
		elements.forEach( element => {
			if ( !element.masks ) {
				return;
			}
			const itemToMask = this.getById( `#${element.id}` );

			const maskGroup = this.snap.g().attr({ id: `${element.id}SymbolMask` })
				.toDefs();

			maskGroup.append( this.snap.rect( 0, 0, 64, 64 ).attr({ fill: '#ffffff' }) );

			element.masks.forEach( maskId => {
				const maskPart = this.getById( `#${maskId}` ).clone();
				maskPart.children().forEach( child => {
					if ( child.type === 'path' ) {
						let c = new AnimateStroke( child, this.scale, 6, {});
						c.apply();

						child.attr({
							stroke: 'black',
							fill: 'black',
							strokeWidth: '10px'

						});
					}
				});

				maskPart.attr({
					stroke: 'black',
					fill: 'black',
					strokeWidth: '10px'
				});
				maskPart.appendTo( maskGroup );
			});

			// this.snap.use( maskGroup );

			const translate = this.symbols[element.id]?.translate?.map( t => -t );
			// maskGroup.transform( `t${transform.map( t => -t ).join( ', ' )}` );

			this.generateTransforms( maskGroup, { translate });

			itemToMask.attr({ mask: maskGroup });
			// this.snap.use( maskGroup ).attr({ opacity: 0.4 });

			// masks.forEach( mask => {

			// });
		});
	}

	symbolToElement ( symbol, group = null ) {
		let use;
		const { id, attributes } = symbol;

		if ( symbol.element.type === 'g' ) {
			use = symbol.element.clone();
			use.appendTo( this.snap );

			use.attr({
				id,
				// href: `${symbol.href}Symbol`,
				...attributes
			});
		} else {
			use = this.snap.use();

			use.attr({
				id,
				href: `${symbol.href}Symbol`,
				...attributes
			});

			use.appendTo( this.snap );
		}
		// const use = symbol.element.clone();
		// console.log( 'symbol', use );
		this.symbols[id].useId = id;

		use.attr({
			id,
			// href: `${symbol.href}Symbol`,
			...attributes
		});

		// this.symbols[id].use = use;

		// generateTransforms

		// // TODO: fix transform-origin for rotations
		// generateTransforms ( item, symbol ) {
		const { transformOrigin, translate, rotate } = symbol;
		this.generateTransforms( use, {
			transformOrigin,
			translate,
			rotate
		});
		return use;
	}

	defsToItems () {
		Object.values( this.symbols ).forEach( symbol => this.symbolToElement( symbol ) );
	}

	getParentGroup ( id ) {
		return this.elements.find( element => element?.elements?.includes( id ) );
	}

	animateAnimated () {
		this.elements.forEach( element => {
			if ( element.type === 'symbol' ) {
				const symbolReference = this.symbols[element.id];
				const elementToAnimate = symbolReference.element.select( '.animate' );
				if ( !elementToAnimate ) {
					return;
				}

				const selfAnimationOverrride = symbolReference?.animation;
				const groupAnimationOverride = element?.animation;
				const finalAnimationOverride = mergeProps( selfAnimationOverrride, groupAnimationOverride );

				const anim = new AnimateStroke( elementToAnimate, this.scale, 6, finalAnimationOverride );
			} else {
				element.elements.forEach( elElement => {
					const symbolReference = this.symbols[elElement];
					const elementToAnimate = symbolReference.element.select( '.animate' );
					if ( !elementToAnimate ) {
						return;
					}
					const selfAnimationOverrride = symbolReference?.animation;
					const groupAnimationOverride = element?.animation;
					const finalAnimationOverride = mergeProps( selfAnimationOverrride, groupAnimationOverride );

					const anim = new AnimateStroke( elementToAnimate, this.scale, 6, finalAnimationOverride );
					// anim.apply();
				});
			}
		});
		console.log( '---' );
	}

	createMask ( symbol ) {
		const maskGroup = this.snap.g().attr({ id: `${symbol.id}SymbolMask` })
			.toDefs();

		const rectSize = this.snap.attr( 'viewBox' ).width;
		const negativeTransform = symbol.translate.map( item => -item );

		maskGroup.append( this.snap.rect( 0, 0, rectSize, rectSize ).attr({ fill: '#ffffff' }) );

		symbol.masks.forEach( mask => {
			if ( !this.symbols[mask] ) {
				console.warn( "can't find def with following id: ", mask, '(', symbol.masks, ')' );
				return;
			}
			const { attributes } = this.symbols[mask];
			const maskSymbolId = this.symbols[mask].symbolId;

			const maskItem = this.snap.use( `#${maskSymbolId}` );
			maskItem.attr({
				...attributes,
				fill: 'black',
				stroke: 'black',
				strokeWidth: 3
			});
			this.generateTransforms( maskItem, this.symbols[mask] );

			maskItem.appendTo( maskGroup );
		});

		maskGroup.transform( `t${negativeTransform.join( ',' )}` );

		return maskGroup;
	}
}

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

export { AnimateStroke, Icon };
// export { loadSymbols, applyMasks };
