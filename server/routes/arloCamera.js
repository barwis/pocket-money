const express = require( 'express' );
const axios = require( 'axios' ).default;
const Stream = require( 'node-rtsp-stream' );

const router = express.Router();
let stream = null;

router.get( '/health', ( req, res, next ) => {
	res.status( 200 ).json({ status: 'ok' });
});

// const ARLO_API_PORT = 5001; // TODO: move this to .env

router.get( '/devices', ( req, res, next ) => {
	axios
		.get( 'http://192.168.50.68:5001/devices' )
		.then( function ( response ) {
			const devices = response.data;
			const streamUrl = {
				rtspsUrl: null,
				wsUrl: null
			};

			Object.values( devices ).forEach( device => { device.streamUrl = streamUrl; });
			res.status( 200 ).json( devices );
		})
		.catch( function ( error ) {
			res.status( 404 ).send( error );
		});
});

const stopStream = () => {
	if ( stream ) {
		stream.stop();
	}
};

router.post( '/startStream', ( req, res, next ) => {
	axios.get( 'http://192.168.50.68:5001/startStream?deviceName=GARDEN', { timeout: 9999 })
		.then( function ( response ) {
			const streamUrl = response.data;
			stopStream();

			// 	$ ffmpeg -i input.mp4 -f mpegts \
			//  -codec:v mpeg1video -s 640x360 -b:v 700k -r 25 -bf 0 \
			//  -codec:a mp2 -ar 44100 -ac 1 -b:a 64k \
			//  output.ts

			stream = new Stream({
				name: 'name',
				streamUrl,
				wsPort: 9999,
				ffmpegOptions: { // options ffmpeg flags
					'-codec:v': 'mpeg1video',
					'-s': '640x357',
					'-b:v': '1500k',
					'-stats': '', // an option with no neccessary value uses a blank string
					'-r': 30, // options with required values specify the value after the key
					'-bf': 0,
					'-codec:a': 'mp2',
					'-ar': 44100,
					'-ac': 1,
					'-b:a': '128k'
				}
			});
			console.log( typeof stream, stream.constructor );
			// res.status( 200 ).send( 'ws://localhost:9999' );
			res.status( 200 ).json({
				rtspsUrl: streamUrl,
				wsUrl: 'ws://192.168.50.68:9999'
			});
		})
		.catch( function ( error ) {
			res.status( 404 ).send( error );
		});
});

router.post( '/stopStream', ( req, res, next ) => {
	stopStream();
	axios.get( 'http://192.168.50.68:5001/stopStream?deviceName=GARDEN', { timeout: 9999 })
		.then( function ( response ) {
			console.log( response );
			res.sendStatus( 200 );
		});
});

module.exports = router;
