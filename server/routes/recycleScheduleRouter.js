const express = require( 'express' );
const db = require( '../db/index' );

const router = express.Router();

router.get( '/health', ( req, res, next ) => {
	res.status( 200 ).json({ status: 'ok' });
});

router.get( '/', async ( req, res, next ) => {
	try {
		let results = await db.getRecycleSchedules();
		res.status( 200 ).json( results );
	} catch ( e ) {
		res.sendStatus( 500 );
	}
});

module.exports = router;
