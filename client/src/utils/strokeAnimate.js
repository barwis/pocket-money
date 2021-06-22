import Snap from 'snapsvg';

class AnimateStroke {
	constructor ( path, scale, strokeWidth, timing ) {
		this.path = path;
		this.strokeWidth = strokeWidth;

		const t = {
			duration: 500,
			iterations: Infinity,
			delay: 0
		};

		this.timing = {
			...t,
			...timing
		};
		// console.log( this.timing );

		const vectorEffect = path.attr( 'vector-effect' );

		this.scale = vectorEffect === null ? 1 : scale;
		this.isScaled = this.scale !== 1;
		this.pathLength = Math.ceil( this.path.getTotalLength() );

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

	get length () {
		return this.isScaled ? this.pathLength * this.scale : this.pathLength;
	}

	get strokeDashOffset () {
		const defaultStrokeDashOffset = this.defaultStyles.strokeDashoffset;
		return this.isScaled ? defaultStrokeDashOffset * this.scale : defaultStrokeDashOffset;
	}

	get strokeDashArray () {
		const defaultStrokeDashArray = this.defaultStyles.strokeDasharray;
		return this.isScaled ? defaultStrokeDashArray.map( item => item * this.scale ).join( ', ' ) : defaultStrokeDashArray.join( ', ' );
	}

	calculate () {
		return {
			'stroke-dashoffset': this.strokeDashOffset,
			'stroke-dasharray': this.strokeDashArray
		};
	}

	apply () {
		this.path.attr({
			'stroke-dashoffset': this.strokeDashOffset,
			'stroke-dasharray': this.strokeDashArray
		});
		const animKeyframes = [
			{
				strokeDashoffset: this.strokeDashOffset + this.strokeDashOffset + this.length
				// opacity: 1
			},
			{
				strokeDashoffset: this.strokeDashOffset
				// opacity: 0
			}
		];

		const timing = this.timing;

		this.path.node.animate(
			animKeyframes,
			timing
		);
	}
};

class Icon {
	constructor ( snap ) {
		this.name = 'Icon';
		this.snap = snap;
		this.symbols = {};
		this.elements = {};
		// this.items = [];
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

	// get item from svg data and puts it into defs for future use

	setScale ( s ) {
		this.scale = s;
	}

	getById ( id ) {
		return this.snap.select( id );
	}

	getSymbolById ( id ) {
		const selectString = `symbol#${id}`;
		// console.log( 'selectString', selectString );
		return this.getById( selectString );
	}

	getUseById ( id ) {
		const selectString = `#${id}`;
		const use = this.getById( selectString );
		console.log( 'useString', selectString, use );
		return use;
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
				// 		generateTransforms ( item, symbol ) {
				// const { transformOrigin, translate, rotate } = symbol;
				// if ( translate ) {

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
					child.attr({
						stroke: 'black',
						fill: 'black',
						strokeWidth: '10px'

					});
				});

				maskPart.attr({
					stroke: 'black',
					fill: 'black',
					strokeWidth: '10px'
				});
				maskPart.appendTo( maskGroup );
			});

			// this.snap.use( maskGroup );

			const translate = this.symbols[element.id].translate.map( t => -t );
			// maskGroup.transform( `t${transform.map( t => -t ).join( ', ' )}` );

			this.generateTransforms( maskGroup, { translate });

			itemToMask.attr({ mask: maskGroup });
			// this.snap.use( maskGroup );

			// masks.forEach( mask => {

			// });
		});
	}

	symbolToElement ( symbol, group = null ) {
		const { id, attributes, symbolId } = symbol;
		const use = this.snap.use();
		if ( group === null ) {
			use.appendTo( this.snap );
		} else {
			use.appendTo( group );
		}

		this.symbols[id].useId = id;

		use.attr({
			id,
			href: `#${symbolId}`,
			...attributes
		});

		this.symbols[id].use = use;

		// generateTransforms

		// // TODO: fix transform-origin for rotations
		// generateTransforms ( item, symbol ) {
		const { transformOrigin, translate, rotate } = symbol;
		this.generateTransforms( use, {
			transformOrigin,
			translate,
			rotate
		});
	}

	defsToItems () {
		Object.values( this.symbols ).forEach( symbol => this.symbolToElement( symbol ) );
	}

	animateAnimated () {
		console.log( this.elements );
		this.elements.forEach( element => {
			if ( element.type === 'symbol' ) {
				const symbolReference = this.symbols[element.id];
				const elementToAnimate = symbolReference.element.select( '.animate' );
				console.log( element.id, symbolReference, elementToAnimate );
				// const anim = new AnimateStroke( itemToAnimate, this.scale, 6, symbol?.animation?.timing );
				// anim.apply();
			} else {
				element.elements.forEach( elElement => {
					const symbolReference = this.symbols[elElement];
					const animationOverrride = symbolReference.animation;
					const elementToAnimate = symbolReference.element.select( '.animate' );
					if ( elementToAnimate ) {
						console.log( elElement, symbolReference, elementToAnimate );
					}
				});
			}
		});
		// this.items.forEach( item => {
		// 	if ( item.type === 'symbol' ) {
		// 		const ownAnimationProps = Object.values( this.symbols ).find( symbol => symbol.id === item.id )?.animation;
		// 		console.log( 'ownAnimationProps', item.id, ownAnimationProps );
		// 	}
		// });

		// Object.values( this.symbols ).forEach( symbol => {
		// 	const itemToAnimate = this.snap.select( `#${symbol.symbolId} .animate` );
		// 	const timing1 = symbol?.animation?.timing;
		// 	const timing2 = this.elements.find( element => element.id === symbol.id )?.timing;
		// 	const timing3 = this.elements.find( element => element.elements?.includes( symbol.id ) )?.timing;
		// 	const symbolId = symbol.id;
		// 	console.log({ symbolId });

		// 	if ( itemToAnimate ) {
		// 		const anim = new AnimateStroke( itemToAnimate, this.scale, 6, symbol?.animation?.timing );
		// 		anim.apply();
		// 	}
		// });
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

	applyMasks () {
		Object.values( this.symbols ).forEach( symbol => {
			if ( symbol.masks ) {
				const maskGroup = this.createMask( symbol );

				const useToUse = this.snap.select( `#${symbol.useId}` );
				useToUse.attr({ mask: maskGroup });
			}
		});
	}

	applyMasks2 ( items ) {
		items.forEach( item => {
			if ( item.masks ) {
				console.log( 'masks for', item.id, ':', item.masks );

				const symbol = this.symbols[item.id];
				const use = this.snap.select;
				const masks = item.masks.map( mask => this.symbols[mask] );

				// console.log( 'symbols', this.symbols );
				// symbol.element
				// masks[0].element

				console.log({
					symbol,
					masks
				});

				const maskGroup = this.snap.g().attr({ id: `${item.id}SymbolMask` })
					.toDefs();

				maskGroup.append( this.snap.rect( 0, 0, 64, 64 ).attr({ fill: '#ffffff' }) );

				masks.forEach( mask => {
					const defRef = this.symbols[mask.id];
					const use = this.snap.use().attr({ href: `#${defRef.id}Symbol` });
					use.attr({
						...mask.attributes,
						fill: 'black',
						stroke: 'black'
					});
					use.transform( `t${mask.translate.join( ', ' )}` );
					use.appendTo( maskGroup );
				});

				const translate = symbol.translate;
				// const translate = [8, 8.5];
				const u = this.snap.use( maskGroup );
				u.transform( `t${translate.map( val => -val ).join( ',' )}` );
				u.attr({ opacity: 0.7 });
				// u.transform( `t${translate.map( val => -val ).join( ',' )}` );

				// const rectSize = this.snap.attr( 'viewBox' ).width;
				// // const negativeTransform = symbol.translate.map( item => -item );

				// maskGroup.append( this.snap.rect( 0, 0, rectSize, rectSize ).attr({ fill: '#ffffff' }) );
			}
		});
	}

	createMask2 ( itemId, maskId ) {

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
