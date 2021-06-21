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
		this.defs = [];
		this.masks = {};
		this.items = [];
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

	applyBasicAttributes ( item, def, attributes ) {
		return item.attr({
			id: def.id,
			href: `#${def.symbolId}`,
			...attributes
		});
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
			return symbol;
		} catch ( e ) {
			return false;
		}
	}

	async loadSymbols ( symbols, scale ) {
		this.snap.clear();
		const promises = [];

		symbols.forEach( s => {
			const { id, symbol, attributes, animation, masks, type } = s;
			const p = snapLoadPromise( symbol.url ).then( data => {
				const def = this.svgSymbolToDefs( data, id, symbol.ref );
				if ( !def ) {
					return;
				}

				// const def = this.loadSymbol( data, id, symbol.ref );
				// if ( !def ) {
				// 	return;
				// }

				this.defs.push( def );

				const use = this.snap.use();

				this.applyBasicAttributes( use, def, attributes );

				this.generateTransforms( use, s );

				use.appendTo( this.snap );

				// add animation
				const p = this.snap.select( `#${id}Symbol .animate` );

				// const timing = animation?.timing;

				if ( p ) {
					const anim = new AnimateStroke( p, scale, 6, animation?.timing );
					anim.apply();
				}

				return {
					id,
					masks
				};
			});

			promises.push( p );
		});

		return Promise.all( promises );
	};

	applyMasks ( items ) {
		items.forEach( item => {
			if ( !item.masks ) {
				return;
			}

			// if has masks ..
			const itemToApplyMask = this.snap.select( `#${item.id}` );

			// create mask group with white background and black copies of each element that needs to be used as mask
			// don't need to append this group to defs
			// when it's used as mask
			// itemToApplyMask.attr({ mask: maskGroup });
			// it's being moved to defs automatically
			const maskGroup = this.snap.g().attr({ id: `${item.id}SymbolMask` })
				.toDefs();

			const rectSize = this.snap.attr( 'viewBox' ).width; // need the size, to cover it all witgh white rectangle

			maskGroup.append( this.snap.rect( 0, 0, rectSize, rectSize ).attr({ fill: '#ffffff' }) );

			item.masks.forEach( mask => {
				const maskProperties2 = this.snap.select( `#${mask}` ).attr();

				const disallowedProps = ['href', 'id'];

				const maskProperties3 = Object.keys( maskProperties2 )
					.filter( key => !disallowedProps.includes( key ) )
					.reduce( ( obj, key ) => {
						obj[key] = maskProperties2[key];
						return obj;
					}, {});

				const maskItem = this.snap.use( `#${mask}Symbol` );

				maskItem.attr({
					...maskProperties3,
					fill: 'black',
					stroke: 'black',
					strokeWidth: 10
				});
				// DO I NEED THIS?
				// maskItem.transform( 't' + maskProperties.translate.join( ',' ) );

				maskItem.appendTo( maskGroup );
			});

			// apply transform
			const m = this.snap.select( `#${item.id}` ).transform().localMatrix.split();
			const newTranslate = `-${m.dx}, -${m.dy}`;

			maskGroup.transform( `t${newTranslate}` );
			itemToApplyMask.attr({ mask: maskGroup });

			this.masks[item.id] = maskGroup.node.id;
		});
	};
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
