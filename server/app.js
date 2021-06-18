const express = require( 'express' );
const cookieParser = require( 'cookie-parser' );

var cors = require( 'cors' );

require( 'dotenv' ).config({ path: '../.env' });

const recycleScheduleRouter = require( './routes/recycleScheduleRouter' );
const weatherApiRouter = require( './routes/weatherRouter' );
const googleRouter = require( './routes/googleCalendar' );
const forecastApiRouter = require( './routes/forecastRouter' );
const imgRouter = require( './routes/img' );
const logRouter = require( './routes/logRouter' );
const cronLog = require( './routes/cronLog' );
const auth = require( './routes/auth' );
const arlo = require( './routes/arloCamera' );
const arloNode = require( './routes/arloNode' );

module.exports = ( config ) => {
	const app = express();
	app.use( require( 'sanitize' ).middleware );
	app.use( cors() );

	// for parsing application/json
	app.use( express.json() );

	// for parsing application/x-www-form-urlencoded
	app.use( express.urlencoded({ extended: true }) );

	app.use( cookieParser() );
	app.use( express.static( 'public' ) );

	if ( app.get( 'env' ) === 'development' ) {
		app.locals.pretty = true;
	}

	// middleware
	app.use( function ( req, res, next ) {
		console.log( 'Time:', Date.now() );
		next();
	});

	app.get( '/health', ( req, res ) => res.status( 200 ).send({ status: 'OK' }) );

	app.use( '/recycle', recycleScheduleRouter );
	app.use( '/weather', weatherApiRouter );
	app.use( '/forecast', forecastApiRouter );
	app.use( '/calendar', googleRouter );
	app.use( '/log', logRouter );
	app.use( '/cronLog', cronLog );
	app.use( '/auth', auth );
	// app.use( '/arlo', arlo );
	app.use( '/arlo', arloNode );

	// app.get( '/img*', imgRouter );
	// app.get( '/img', imgRouter );

	app.listen(
		process.env.API_PORT,
		process.env.LOCAL_IP,
		() => console.log( `App listening at http://${process.env.LOCAL_IP}:${process.env.API_PORT}` ) );

	return app;
};
