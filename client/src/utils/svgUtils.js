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

export const setAttributes = ( el, attrs ) => Object.entries( attrs ).forEach( ( [key, value] ) => el.setAttribute( key, value ) );

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
