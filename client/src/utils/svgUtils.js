import Snap from 'snapsvg';

export const _diff = ( a, b ) => {
	const r = {};
	Object.keys( a ).forEach( key => {
		r[key] = a[key] - b[key];
	});
	return r;
};

export const processParam = ( p ) => {
	let arr;
	try {
		// eslint-disable-next-line no-eval
		arr = eval( p );
	} catch {
		arr = false;
	}
	return arr;
};

export const setAttributes = ( el, attrs ) => Object.entries( attrs ).forEach( ( [key, value] ) => {
	const _key = key.replace( /[A-Z&]/g, m => '-' + m.toLowerCase() );
	el.setAttribute( _key, value );
});

export function getAttributes ( item, attributes, callback = false ) {
	return attributes.reduce( ( obj, propName ) => {
		if ( !item.hasAttribute( propName ) ) {
			return obj;
		}
		const propNameCamelCased = propName.replace( /(-.)/g, function ( x ) { return x[1].toUpperCase(); });
		const value = callback ? callback( item.getAttribute( propName ) ) : item.getAttribute( propName );
		const newObj = { [propName]: value };
		if ( propName !== propNameCamelCased ) {
			newObj[propNameCamelCased] = value;
		}

		return Object.assign( obj, newObj );
	}, {});
}

export const stringToArray = ( p, delimiter = ' ' ) => {
	try {
		const arr = p.split( delimiter ).map( item => parseInt( item, 10 ) );
		return {
			x: arr[0],
			y: arr[1],
			width: arr[2],
			height: arr[3]
		};
	} catch {
		return {};
	}
};

export 	const getPosition = ( item ) => {
	if ( !item ) {
		return false;
	}
	const i = item.node || item;
	return {
		x: parseFloat( i.getAttribute( 'x' ) ),
		y: parseFloat( i.getAttribute( 'y' ) )
	};
};

// (accumulator, currentValue, index, array)
export const getViewBox = ( viewBoxProp ) => {
	const viewBoxArray = viewBoxProp.split( ' ' );
	if ( viewBoxArray.length !== 4 ) {
		return {};
	}

	return {
		x: viewBoxArray[0],
		y: viewBoxArray[1],
		width: viewBoxArray[2],
		height: viewBoxArray[3]
	};
	// const preppedViewBox = '[' + viewBoxProp.split( ' ' ).map( item => `'${item}'` )
	// 	.join( ', ' ) + ']';
	// const viewBox = processParam( preppedViewBox );
	// if ( viewBox.length !== 4 ) {
	// 	return null;
	// }
	// return ['x', 'y', 'width', 'height'].reduce( ( obj, propName, index, array ) => {
	// 	return Object.assign( obj, { [propName]: viewBox[index] });
	// }, {});
};

export const getScale = ( snap, customWidth ) => {
	if ( snap ) {
		const viewBoxWidth = snap.node.viewBox.baseVal.width;
		const width = snap.node.width.baseVal.value;
		const scale = width / viewBoxWidth;
		// const customMultiplier =
		return scale;
	} else {
		return undefined;
	}
};

export const getSvgScale = ( svg ) => {
	try {
		const { viewBox, width } = getAttributes( svg, ['viewBox', 'width'] );
		const vb = getViewBox( viewBox );
		return width / vb.width;
	} catch ( e ) {
		console.warn( e );
	}
};

export const stringToMiliseconds = string => {
	try {
		const multiplier = string.search( 's' ) !== -1 ? 1000 : 1;
		return parseFloat( string ) * multiplier;
	} catch {
		return 0;
	}
};

export const mergeProps = ( obj1, obj2 ) => {
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

export class SnapLoader {
	constructor ( snap ) {
		this.snap = snap;
		this.symbols = [];
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

	loadSymbols ( symbols ) {

	}
}

export class SymbolLoader {
	constructor () {
		this.filesLoaded = [];
		this.symbols = {};
	}

	checkIfFileLoaded ( path ) { return this.filesLoaded.find( entry => entry.path === path ); }

	loadFile ( path, onLoad ) {
		const fileAlreadyLoaded = this.checkIfFileLoaded( path );

		const _self = this;
		return new Promise( ( resolve, reject ) => {
			if ( /(?:\.([^.]+))?$/.exec( path )[1] !== 'svg' ) {
				reject( new Error( 'not a .svg file' ) );
			}
			try {
				if ( fileAlreadyLoaded ) {
					const data = fileAlreadyLoaded.data;

					if ( onLoad ) {
						resolve( onLoad( data ) );
					} else {
						resolve( data );
					}
				} else {
					var oReq = new XMLHttpRequest();
					oReq.onload = function ( e ) {
						const xml = e.target.responseXML;
						const fileData = {
							path,
							data: xml
						};
						_self.filesLoaded.push( fileData );

						if ( onLoad ) {
							resolve( onLoad( xml ) );
						} else {
							resolve( xml );
						}
					};
					oReq.open( 'get', path, true );
					oReq.send();
				}
			} catch ( e ) {
				reject( new Error( e ) );
			}
		});
	}

	loadSymbolFromFile ( params ) {
		const { url, symbol } = params;

		const onLoad = ( xml ) => {
			const s = xml.querySelector( symbol );
			this.symbols[symbol] = s;
			return s;
		};

		return this.loadFile( url, onLoad );
	}
}
