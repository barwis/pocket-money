const express = require( 'express' );
const router = express.Router();
const db = require( '../db/index' );

const { OAuth2Client } = require( 'google-auth-library' );
const client = new OAuth2Client( process.env.CLIENT_ID );

router.post( '/', async ( req, res, next ) => {
	const { token } = req.body;
	// console.log( '1:', token ); // save this

	// console.log( '2:', process.env.CLIENT_ID );
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID
	});
	const p = ticket.getPayload();
	// eslint-disable-next-line camelcase
	const { name, given_name, family_name, email, picture } = p;

	const user = {
		name,
		givenName: given_name,
		familyName: family_name,
		email,
		picture,
		token
	};

	// const result = await db.addUser( user );
	const result = await db.getUserIdByEmail( email );
	console.log( 'res', result );

	// db.upsertUser( user );
	// const c = db.getUserIdByEmail( email );
	// console.log( 'user', c );

	// const result = await db.getUserIdByEmail( email );

	// console.log( email, 'result', { result });
	// res.status( 200 ).json( result );

	res.status( 200 );
	res.json({});
});

module.exports = router;
