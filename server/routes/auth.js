const express = require( 'express' );
const router = express.Router();

const { OAuth2Client } = require( 'google-auth-library' );
const client = new OAuth2Client( process.env.CLIENT_ID );

router.post( '/', async ( req, res, next ) => {
	const { token } = req.body;
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.APP_GOOGLE_CLIENT_ID
	});
	const { name, email, picture } = ticket.getPayload();
	const user = await db.user.upsert({
		where: { email },
		update: {
			name,
			picture
		},
		create: {
			name,
			email,
			picture
		}
	});
	res.status( 201 );
	res.json( user );
	// process.env.LOCAL_IP
});

module.exports = router;
