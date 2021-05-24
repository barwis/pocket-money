const express = require( 'express' );
const axios = require( 'axios' ).default;
const router = express.Router();

// const API_ENDPOINT = `api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&appid=${API_KEY}`;

const API_ENDPOINT = 'https://api.weatherbit.io/v2.0/forecast/daily?city=Orpington&country=GB&key=ea1070c1e01e458a9b8b2476725344ed';

router.get( '/', async ( req, res, next ) => {
	try {
		const response = await axios.get( API_ENDPOINT );
		const dateOptions = { weekday: 'short' };

		const r = response.data.data.map( ( item, index ) => {
			// parse ISO date to day of week
			const date = new Date( item.datetime ).toLocaleDateString( 'en-GB', dateOptions );

			return ({
				icon: `https://www.weatherbit.io/static/img/icons/${item.weather.icon}.png`,
				temp: item.temp,
				day: date,
				code: item.weather.code

			});
		}).slice( 1, 8 );
		res.status( 200 ).json( r );
	} catch ( error ) {
		res.sendStatus( 500 );
	}
});

module.exports = router;
