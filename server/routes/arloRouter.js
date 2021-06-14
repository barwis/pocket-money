const express = require( 'express' );
const router = express.Router();
const Arlo = require( 'node-arlo' );
const Stream = require( 'node-rtsp-stream' );

const arlo = new Arlo();

router.get( '/health', ( req, res, next ) => {
	res.status( 200 ).json({ status: 'ok' });
});

function dupa () {
	console.log( 'dupa' );
	console.log( this );
	// console.log( 'arguments', arguments );
}

function getUrl ( url ) {
	console.log( 'getting stream...' );
	console.log( 'url', url );
}

const getDevicesData = () => {
	const devices =
			Object.entries( arlo.devices ).map( ( [key, value] ) => {
				const { id, device } = value;
				return {
					id,
					name: device.deviceName,
					type: device.deviceType,
					snap: device.presignedLastImageUrl
				};
			});
	return devices;
};

router.get( '/', async ( req, res, next ) => {
	const user = 'lordzix@gmail.com';
	const password = 'VenCeym3';
	// arlo.subscribe( dupa );
	console.log( 'logging in' );

	arlo.login( user, password, () => {
		console.log( 'getting devices...' );
		let devices;
		if ( Object.keys( arlo.devices ).length === 0 ) {
			console.log( 'getting devices list' );

			arlo.getDevices( () => {
				devices = getDevicesData();
				res.status( 200 ).json( devices );
			});
		} else {
			console.log( 'devices list already set' );

			devices = getDevicesData();
			res.status( 200 ).json( devices );
		}

		// arlo.getDevices( () => {
		// 	console.log( 'got devices' );
		// 	devices = getDevicesData();
		// 	// const frontDoor = arlo.devices['A5D2117VA0FBB'];

		// 	// console.log( 'frontDoor', frontDoor );
		// 	console.log( 'devices', devices );
		// 	res.status( 200 ).json( devices );
		// 	// arlo.getStream( frontDoor, ( url ) => {
		// 	// 	res.status( 200 ).json({ url });
		// 	// });
		// 	// res.sendStatus( 200 );
		// });
	});
});

module.exports = router;
