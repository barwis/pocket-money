const express = require( 'express' );
const router = express.Router();
const path = require( 'path' );
const fsR = require( 'fs-reverse' );

var appDir = path.dirname( __dirname );
const p = path.join( appDir, '..', 'services', 'recycleSchedule', 'CRON', 'logfile.log' );

router.get( '/', async ( req, res, next ) => {
	const result = [];

	let entries = 0;

	try {
		const readStream = fsR( p, {});
		const newEntryDelimiter = '---';
		readStream.on( 'data', ( line ) => {
			const trimmedLine = line.trim();
			if ( trimmedLine ) { // have this check to make sure empty lines are not parsed
				if ( trimmedLine.endsWith( newEntryDelimiter ) ) {
					entries += 1;
				}

				console.log( trimmedLine );
			}
		});
	} catch ( err ) {
		console.error( err );
	}

	// try {
	// 	const rl = createInterface({
	// 		input: createReadStream( p ),
	// 		crlfDelay: Infinity
	// 	});

	// 	rl.on( 'line', ( line ) => {
	// 		console.log( 'line', line );
	// 	});

	// 	// await once( rl, 'close' );

	// 	console.log( 'File processed.' );
	// } catch ( err ) {
	// 	console.error( err );
	// }

	res.status( 200 ).json({ 'asd': p });
});

module.exports = router;
