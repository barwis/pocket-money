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

	// TODO: fix transform-origin for rotations
	generateTransforms ( item, symbol ) {
		const { transformOrigin, translate, rotate } = symbol;
		const myMatrix = new Snap.Matrix();

		if ( transformOrigin ) {
			item.attr( 'transform-origin', transformOrigin.join( ' ' ) );
		}

		if ( translate ) {
			myMatrix.translate( translate[0], translate[1] );
		}
		if ( rotate ) {
			myMatrix.rotate( rotate );
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
			symbol.attr( 'data-id', id );
			symbol.attr( 'data-symbolId', symbolId );

			this.symbols[id] = {
				symbolId,
				id,
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

		symbols.forEach( s => {
			const p = this.createSymbol( s );
			promises.push( p );
		});

		return Promise.all( promises );
	};

	loadlements ( elements ) {
		elements.forEach( element => {
			const { name, type: elementType, elements, translate } = element;
			// console.log( element );
			if ( elementType === 'symbol' ) {
				const symbol = this.symbols[element.name];
				this.symbolToElement( symbol );
			} else {
				const group = this.snap.g().appendTo( this.snap );
				group.attr({ id: name });
				// 		generateTransforms ( item, symbol ) {
				// const { transformOrigin, translate, rotate } = symbol;
				if ( translate ) {
					this.generateTransforms( group, { translate });
				}
				elements?.forEach( element => {
					const symbol = this.symbols[element];

					this.symbolToElement( symbol, group );
				});
			}
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

		use.attr({
			id,
			href: `#${symbolId}`,
			...attributes
		});

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
		Object.values( this.symbols ).forEach( symbol => {
			const itemToAnimate = this.snap.select( `#${symbol.symbolId} .animate` );
			console.log( symbol.symbolId );

			if ( itemToAnimate ) {
				const anim = new AnimateStroke( itemToAnimate, this.scale, 6, symbol?.animation?.timing );
				anim.apply();
			}
		});
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
				strokeWidth: 10
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
