const express = require( 'express' );
const axios = require( 'axios' ).default;

const router = express.Router();

router.get( '/health', ( req, res, next ) => {
	res.status( 200 ).json({ status: 'ok' });
});

router.get( ['/img/*/:image'], async ( req, res, next ) => {
	const imgRoute = req.params[0];
	const filename = req.params.image.split( '.' );
	if ( filename.length !== 3 ) { return res.sendStatus( 400 ); }

	if ( !process.env.LOCAL_IP || !process.env.PORT ) {
		return res.status( 500 ).json({ error: 'unable to load env variables' });
	}

	const imgUrl = `${req.protocol}://${process.env.LOCAL_IP}:${process.env.PORT}/${imgRoute}/${filename[1]}/${filename[0]}.${filename[1]}`;
	const fallbacImagekUrl = `${req.protocol}://${process.env.LOCAL_IP}:${process.env.PORT}/${imgRoute}/${filename[2]}/${filename[0]}.${filename[2]}`;

	try {
		await axios.get( imgUrl, { method: 'HEAD' });
		res.status( 200 ).json({ url: imgUrl });
	} catch ( e ) {
		try {
			await axios.get( fallbacImagekUrl, { method: 'HEAD' });
			res.status( 200 ).json({ url: fallbacImagekUrl });
		} catch ( e ) {
			res.sendStatus( 404 );
		}
	}
});

module.exports = router;
