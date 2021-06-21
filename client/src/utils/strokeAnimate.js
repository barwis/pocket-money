import Snap from 'snapsvg';

class AnimateStroke {
	constructor ( path, scale, strokeWidth, foo, timing = {
		duration: 500,
		iterations: Infinity,
		delay: 0
	}) {
		this.path = path;
		this.strokeWidth = strokeWidth;
		this.timing = timing;

		this.delay = !!foo;

		const vectorEffect = path.attr( 'vector-effect' );

		this.scale = vectorEffect === null ? 1 : scale;
		this.isScaled = this.scale !== 1;
		this.pathLength = Math.ceil( this.path.getTotalLength() );

		if ( this.delay ) {
			timing.delay += timing.duration * 0.8;
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

const loadSymbols = async ( snap, symbols, scale ) => {
	snap.clear();
	const promises = [];

	symbols.forEach( symbol => {
		const { id, symbolRef, symbolUrl, attributes, foo, transformOrigin, translate, rotate, masks } = symbol;

		const p = snapLoadPromise( symbolUrl ).then( data => {
			const symbol = data.select( `#${symbolRef}` );
			symbol.attr({ id: `${id}Symbol` });
			symbol.appendTo( snap ).toDefs();

			const use = snap.use().attr({
				id: `${id}`,
				href: `#${id}Symbol`,
				...attributes
			})
				.appendTo( snap );
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
			let f = foo || false;

			if ( p ) {
				const anim = new AnimateStroke( p, scale, 6, f );
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

const applyMasks = ( snap, items ) => {
	// / just to test something out

	items.forEach( item => {
		if ( !item.masks || item.masks.length === 0 ) {
			return;
		}

		// if has masks ..
		const itemToApplyMask = snap.select( `#${item.id}` );

		// create mask group with white background and black copies of each element that needs to be used as mask
		const maskGroup = snap.g().attr({ id: `${item.id}SymbolMask` });

		const rectSize = snap.attr( 'viewBox' ).width; // need the size, to cover it all witgh white rectangle

		maskGroup.append( snap.rect( 0, 0, rectSize, rectSize ).attr({ fill: '#ffffff' }) );

		item.masks.forEach( mask => {
			const maskProperties2 = snap.select( `#${mask}` ).attr();

			const disallowedProps = ['href', 'id'];

			const maskProperties3 = Object.keys( maskProperties2 )
				.filter( key => !disallowedProps.includes( key ) )
				.reduce( ( obj, key ) => {
					obj[key] = maskProperties2[key];
					return obj;
				}, {});

			const maskItem = snap.use( `#${mask}Symbol` );

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
		const m = snap.select( `#${item.id}` ).transform().localMatrix.split();
		const newTranslate = `-${m.dx}, -${m.dy}`;

		maskGroup.transform( `t${newTranslate}` );
		itemToApplyMask.attr({ mask: maskGroup });
	});
};

export { AnimateStroke, loadSymbols, applyMasks };
