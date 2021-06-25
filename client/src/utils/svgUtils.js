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
		arr = [];
	}
	return arr;
};

export const setAttributes = ( el, attrs ) => Object.entries( attrs ).forEach( ( [key, value] ) => {
	const _key = key.replace( /[A-Z&]/g, m => '-' + m.toLowerCase() );
	el.setAttribute( _key, value );
});

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

export const getScale = ( snap, customWidth ) => {
	if ( snap ) {
		const viewBoxWidth = snap.node.viewBox.baseVal.width;
		const width = snap.node.width.baseVal.value;
		const scale = width / viewBoxWidth; ;
		// const customMultiplier =
		return scale;
	} else {
		return undefined;
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
