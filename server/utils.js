const path = require( 'path' );
const fs = require( 'fs' );
const fsPromises = require( 'fs' ).promises;
const jsdom = require( 'jsdom' );
const { JSDOM } = jsdom;

// TODO: add unit tests

/**
 * Look for a number in array. If not found, returns closest number from array
 * @param  {Object[]} arr Array to look into
 * @param  {number} needle Number to locate
 * @param  {string} [method="floor"] comparison method
 * @returns {number} needle - if found in [arr]; otherwise returns closest number from arr
 */
const closestNumInArray = ( arr, needle, method = 'floor' ) => {
	return arr.reduce( ( a, b ) => {
		if ( method === 'floor' ) {
			return Math.abs( b - needle ) <= Math.abs( a - needle ) ? b : a;
		}
		if ( method === 'ceil' ) {
			return Math.abs( b - needle ) < Math.abs( a - needle ) ? b : a;
		}
	});
};
const func = filenames => {
	return Promise.all(
	  filenames.map( f => fsPromises.readFile( f ) )
	);
};

class SymbolLoader {
	constructor () {
		this.filesLoaded = [];
		this.symbols = {};
		this.clientPublicPath = path.join( process.cwd(), '..', 'client', 'public' );
		console.log( 'this.clientPublicPath', this.clientPublicPath );
	}

	checkIfFileLoaded ( path ) { return this.filesLoaded.find( entry => entry.path === path ); }

	async loadSymbols ( symbols ) {
		for ( const symbol of symbols ) {
			const data = await this.loadSymbolFromFile( symbol );
			console.log( 'symbol loaded', symbol.url );
		}

		console.log( 'all done' );
	}

	loadFile ( p, onLoad ) {
		const fileAlreadyLoaded = this.checkIfFileLoaded( path );

		const _self = this;
		return new Promise( ( resolve, reject ) => {
			if ( /(?:\.([^.]+))?$/.exec( p )[1] !== 'svg' ) {
				reject( new Error( 'not a .svg file' ) );
			}

			const filePath = path.join( this.clientPublicPath, p );
			try {
				if ( fileAlreadyLoaded ) {
					const data = fileAlreadyLoaded.data;

					if ( onLoad ) {
						resolve( onLoad( data ) );
					} else {
						resolve( data );
					}
				} else {
					console.log( 'reading file', filePath );

					fsPromises
						.readFile( filePath )
						.then( data => {
							const dom = new JSDOM( data.toString() );
							const fileData = {
								filePath,
								data
							};
							_self.filesLoaded.push( fileData );
							// const sunSymbol = dom.window.document.querySelector( 'symbol' );
							if ( onLoad ) {
								resolve( onLoad( dom.window.document ) );
							} else {
								resolve( dom.window.document );
							}
						})
						.catch( reject );

					// fsPromises.readFile( filePath, function ( err, data ) {
					// 	if ( err ) {
					// 		reject( err );
					// 	}
					// 	console.log( 'reading file', filePath );
					// 	//   _self.filesLoaded.push( fileData );

					// 	console.log( data );
					// 	const dom = new JSDOM( data.toString() );
					// 	const xml = dom.serialize();
					// 	const fileData = {
					// 		filePath,
					// 		data: xml
					// 	};

					// 	_self.filesLoaded.push( fileData );
					// 	const sunSymbol = dom.window.document.querySelector( 'symbol' );
					// 	if ( onLoad ) {
					// 		resolve( onLoad( dom.window.document ) );
					// 	} else {
					// 		resolve( dom.window.document );
					// 	}

					// 	// resolve( dom.serialize() );
					// });

					// var oReq = new XMLHttpRequest();
					// oReq.onload = function ( e ) {
					// 	const xml = e.target.responseXML;
					// 	const fileData = {
					// 		path,
					// 		data: xml
					// 	};
					// 	_self.filesLoaded.push( fileData );

					// 	if ( onLoad ) {
					// 		resolve( onLoad( xml ) );
					// 	} else {
					// 		resolve( xml );
					// 	}
					// };
					// oReq.open( 'get', path, true );
					// oReq.send();
				}
			} catch ( e ) {
				reject( new Error( e ) );
			}
		});
	}

	loadSymbolFromFile ( params ) {
		const { url, symbol } = params;

		const onfileload = ( xml ) => {
			const s = xml.querySelector( symbol );
			this.symbols[symbol] = s;
			return s;
		};

		return this.loadFile( url, onfileload );
	}
}

module.exports = {
	closestNumInArray,
	SymbolLoader
};
