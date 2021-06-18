const express = require( 'express' );
const router = express.Router();
const util = require( 'util' );
const ArloNodeWrapper = require( '../utils/arloNodeWrapper' );

const user = 'lordzix@gmail.com';
const password = 'VenCeym3';

const arlo2 = new ArloNodeWrapper();

const login = async ( user, password ) => {
	const token = await arlo2.login( user, password );
	return token;
};

const streams = {};

const startStream = ( device ) => {
	console.log( 'attempting to hook into device' );

	arlo2.getStream( device, ( url ) => {
		console.log( 'attempting to hook into device' );
		console.log( url );
	});
};

let prevMessage = {};

const processData = data => {
	if ( util.isDeepStrictEqual( data, prevMessage ) ) {
		return;
	}

	prevMessage = data;
	var dt = new Date();
	let time = `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}:${dt.getMilliseconds()}`;

	// console.log( time, data );

	if ( data.properties && data.properties.activityState && data.properties.activityState === 'startUserStream' ) {
		console.log( 'get stream url', data.from );
		if ( data.from ) {
			const device = arlo2.getDeviceById( data.from );
			startStream( device.device );
		}
	}
};

login( user, password ).then( () => {
	console.log( 'logged in, subscribe' );
	// arlo2.getFixedDevices().then( ( data ) => { console.log( 'got devices' ); console.log( data ); });
	// console.log();
	arlo2.on( 'message', processData );
});

router.use( '/', async ( req, res, next ) => {
	const token = await arlo2.login( user, password );
	res.set( 'Arlo-Token', token );
	next();
});

router.get( '/devices', async ( req, res ) => {
	// arlo2.login( user, password ).then( async () => {
	// 	console.log( 'try to get devices' );

	// 	const devices = await arlo2.getFixedDevices();
	const c = await arlo2.getFixedDevices();
	res.status( 200 ).json( c );
	// });
});

module.exports = router;
