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
