const express = require( 'express' );
const jsdom = require( 'jsdom' );
const { JSDOM } = jsdom;
const path = require( 'path' );
const fs = require( 'fs' );
const utils = require( '../utils' );

const router = express.Router();

router.get( '/health', ( req, res, next ) => {
	res.status( 200 ).json({ status: '/img ok' });
});
// app.get( '/users/:userId/books/:bookId'
const clientPublicPath = path.join( process.cwd(), '..', 'client', 'public' );

router.get( '/:size/:name', ( req, res ) => {
	const symbols = [
		{
			url: '/weather/64x64/day/svg/defs/symbols.svg',
			symbol: '#cloud-small'
		},
		{
			url: '/weather/64x64/day/svg/defs/symbols.svg',
			symbol: '#cloud-big'
		}

	];

	const pathtoFile = '/weather/64x64/day/svg/defs/symbols.svg';
	const finalPath = path.join( clientPublicPath, pathtoFile );

	const symbolsLoader = new utils.SymbolLoader();
	symbolsLoader.loadSymbolFromFile( symbols[0] ).then( () => {
		console.log( 'symbols', symbolsLoader.symbols );
	});

	console.log( req.params );

	const svg = `<svg
	id="svg"
	width="112"
	height="112"
	version="1.1"
	viewBox="0 0 64 64"
	xmlns="http://www.w3.org/2000/svg">
	<rect x="0" y="0" width="64" height="64" fill="blue" stroke="none"/></svg>`;
	const dom = new JSDOM( svg );

	// fs.readFile( finalPath, function ( err, data ) {
	// 	if ( err ) {
	// 		throw err;
	// 	}
	// 	console.log( 'data', data.toString() );
	// });

	// jsdom.env( '', ['node_modules/snapsvg/dist/snap.svg.js'], ( error, window ) => {
	// 	if ( error ) throw error;
	// 	const s = parseInt( req.params.size, 10 );

	// 	const paper = window.Snap( s, s );

	// 	const rect = paper.rect( 0, 0, s, s );

	// 	console.log( paper.toString() );
	// });

	res.send( dom.serialize() );
});

module.exports = router;
