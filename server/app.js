const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const session = require( 'express-session' );
const path = require( 'path' );
const createError = require( 'http-errors' );

var cors = require( 'cors' );

require( 'dotenv' ).config({ path: '../.env' });

const recycleScheduleRouter = require( './routes/recycleScheduleRouter' );
const weatherApiRouter = require( './routes/weatherRouter' );
const googleRouter = require( './routes/googleCalendar' );
const forecastApiRouter = require( './routes/forecastRouter' );
const imgRouter = require( './routes/img' );
const logRouter = require( './routes/logRouter' );

module.exports = ( config ) => {
	const app = express();
	app.use( require( 'sanitize' ).middleware );
	app.use( cors() );

	const port = 5000;

	app.use( bodyParser.urlencoded({ extended: true }) );
	// app.use( bodyParser.json() );
	// app.use( bodyParser() );
	app.use( cookieParser() );
	app.use( express.static( 'public' ) );

	if ( app.get( 'env' ) === 'development' ) {
		app.locals.pretty = true;
	}

	// use routes
	app.get( '/health', ( req, res ) => res.status( 200 ).send({ status: 'OK' }) );

	app.use( '/recycle', recycleScheduleRouter );
	app.use( '/weather', weatherApiRouter );
	app.use( '/forecast', forecastApiRouter );
	app.use( '/calendar', googleRouter );
	app.use( '/log', logRouter );
	// app.use(['/img', '/img*'], imgRouter);
	app.get( '/img*', imgRouter );
	app.get( '/img', imgRouter );

	app.listen( port, process.env.LOCAL_IP, () => console.log( `App listening at http://${process.env.LOCAL_IP}:${port}` ) );

	return app;
};
