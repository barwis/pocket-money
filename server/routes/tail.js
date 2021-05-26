const express = require( 'express' );
const router = express.Router();
const path = require( 'path' );

// Tail = require('tail').Tail;

// tail = new Tail("fileToTail");

// tail.on("line", function(data) {
//   console.log(data);
// });

// tail.on("error", function(error) {
//   console.log('ERROR: ', error);
// });

var appDir = path.dirname( __dirname );
const p = path.join( appDir, '..', 'services\recycleSchedule\CRON\logfile.log' );

router.get( '/', async ( req, res, next ) => {
	res.status( 200 ).json({ 'asd': p });
});

module.exports = router;
