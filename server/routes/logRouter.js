const express = require( 'express' );
const router = express.Router();
const db = require( '../db/index' );

router.get( '/health', ( req, res, next ) => {
	res.status( 200 ).json({ status: 'ok' });
});

router.get( '/', async ( req, res, next ) => {
	try {
		const result = await db.getLogs();
		res.status( 200 ).json( result );
	} catch ( e ) {
		res.sendStatus( 404 );
	}
});

router.post( '/', async ( req, res, next ) => {
	const { msg, level, time } = req.body;
	try {
		const result = await db.addLog( msg, level, time );
		res.status( 200 ).send( `Row ${result.insertId} added` );
	} catch ( e ) {
		console.log( 'error', e );
		res.sendStatus( 404 );
	}
});

module.exports = router;
