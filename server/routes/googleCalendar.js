const express = require( 'express' );

const router = express.Router();

const { google } = require( 'googleapis' );
const { OAuth2 } = google.auth;

const fs = require( 'fs' );

let credentials = JSON.parse( fs.readFileSync( './config/credentials.json' ) );

const oAuth2Client = new OAuth2(
	credentials.client_id,
	credentials.client_secret
);

oAuth2Client.setCredentials({ refresh_token: credentials.refresh_token });

const calendar = google.calendar({
	version: 'v3',
	auth: oAuth2Client
});

router.get( '/health', ( req, res ) => {
	res.status( 200 ).json({ status: 'ok' });
});

router.get( '/', async ( req, res, next ) => {
	const events = await listEvents();
	res.status( 200 ).json( events );
});

async function listEvents () {
	let res = await calendar.events.list({
		calendarId: credentials.family_calendar_id,
		timeMin: ( new Date() ).toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime'
	});

	const events = await res.data.items;

	const distinctEvents = [];
	const map = new Map();

	for ( const item of events ) {
		if ( !map.has( item.etag ) ) {
			map.set( item.etag, true ); // set any value to Map
			distinctEvents.push( item );
		}
	}

	return distinctEvents;
}

module.exports = router;
