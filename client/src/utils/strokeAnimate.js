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

export { AnimateStroke, loadSymbols };
