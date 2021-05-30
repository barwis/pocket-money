const express = require( 'express' );
const axios = require( 'axios' ).default;
const router = express.Router();
const path = require( 'path' );
const db = require( '../db/index' );

const API_ENDPOINT3 = 'http://api.weatherapi.com/v1/forecast.json?key=69466ae5b9a04898bb3193451211902&q=Orpington&days=1&aqi=no&alerts=no';

router.get( '/health', ( req, res, next ) => {
	res.status( 200 ).json({ status: 'ok' });
});

router.get( '/', async ( req, res, next ) => {
	try {
		const response = await axios.get( API_ENDPOINT3 );
		const r = response.data;
		const data = {
			location: {
				name: r.location.name,
				country: r.location.country
			},
			current: {
				condition: {
					icon: path.parse( r.current.condition.icon ).name,
					text: r.current.condition.text
				},
				temp_c: r.current.temp_c,
				feelslike_c: r.current.feelslike_c,
				wind_kph: r.current.wind_kph,
				humidity: r.current.humidity,
				precip_mm: r.current.precip_mm,
				pressure_mb: r.current.pressure_mb
			},
			forecast: {
				maxtemp_c: r.forecast.forecastday[0].day.maxtemp_c,
				mintemp_c: r.forecast.forecastday[0].day.mintemp_c
			}
		};

		res.status( 200 ).json( data );
	} catch ( error ) {
		res.sendStatus( 500 );
	}
});

router.post( '/', async ( req, res ) => {
	const icon = req.body.icon;
	if ( !icon ) {
		res.sendStatus( 204 );
	} else {
		let results = await db.saveIconUsage( icon );
		res.status( 200 ).json( results );
	}
});

module.exports = router;
