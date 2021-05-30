import * as webpackConfig from '../webpack.config.js';
const path = require( 'path' );

const dotenv = require( 'dotenv' ).config({ path: path.resolve( process.cwd(), '..', '.env' ) });

// locate webpack plugin with env variables
const df = webpackConfig.plugins.find( item => item.constructor.name === 'DefinePlugin' );

describe( 'webpack config', () => {
	it.each( [
		[ 'LOCAL_IP', dotenv.parsed.LOCAL_IP],
		[ 'PORT', dotenv.parsed.PORT],
		[ 'CLIENT_ID', dotenv.parsed.CLIENT_ID],
		[ 'API_PORT', dotenv.parsed.API_PORT]
	] )( 'expect %p to exist', ( name, variable ) => {
		expect( variable ).not.toBe( undefined );
	});

	it.each( [
		[ 'LOCAL_IP', dotenv.parsed.LOCAL_IP],
		[ 'PORT', dotenv.parsed.PORT],
		[ 'CLIENT_ID', dotenv.parsed.CLIENT_ID],
		[ 'API_PORT', dotenv.parsed.API_PORT]
	] )( 'expect %p to be set in webpack plugin', ( varName, varValue ) => {
		expect( df.definitions[varName] ).toEqual( JSON.stringify( varValue ) );
	});
});
