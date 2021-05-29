const express = require( 'express' );
const router = express.Router();

const { OAuth2Client } = require( 'google-auth-library' );
const client = new OAuth2Client( process.env.CLIENT_ID );

router.post( '/', async ( req, res, next ) => {
	const { token } = req.body;
	console.log( '1:', token );
	console.log( '2:', process.env.CLIENT_ID );
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID
	});
	const p = ticket.getPayload();
	const { name, given_name, email, picture } = p;

	const user = {
		name,
		given_name,
		email,
		picture
	};

	console.log( 'user', p );
	// const user = await db.user.upsert({
	// 	where: { email },
	// 	update: {
	// 		name,
	// 		picture
	// 	},
	// 	create: {
	// 		name,
	// 		email,
	// 		picture
	// 	}
	// });
	res.status( 201 );
	res.json({});
});

module.exports = router;
