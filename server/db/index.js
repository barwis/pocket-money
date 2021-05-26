const utils = require( '../utils' );
let dbmodule;

try {
	const mysql = require( 'mysql' );
	dbmodule = mysql;
} catch ( err ) {
	console.log( `Error loading mysql. let's try something else...` );
	console.log( err );
	const mariadb = require( 'mariadb' );
	dbmodule = mariadb;
}
const pool = dbmodule.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: 'smart_home'
});

const LEVEL = {
	CRITICAL: 50,
	ERROR: 40,
	WARNING: 30,
	INFO: 20,
	DEBUG: 10,
	NOTSET: 0
};

let db = {};

const poolQuery = ( q, v = [] ) => {
	return new Promise( ( resolve, reject ) => {
		pool.query( q, v, ( err, results ) => {
			if ( err ) {
				return reject( err );
			}

			return resolve( results );
		});
	});
};

db.getLogs = () => poolQuery( 'select * from logMessages' );

db.addLog = ( msg, level = 'DEBUG', time = false ) => {
	const d = new Date();
	const _time = time || `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.toLocaleTimeString()}`;
	let _level;
	if ( !level ) {
		_level = 10;
	}

	if ( +level ) {
		_level = Object.values( LEVEL ).includes( parseInt( level, 10 ) )
			? level
			: utils.closestNumInArray( Object.values( LEVEL ), parseInt( level, 10 ) ).toString();
	} else {
		_level = LEVEL[level] ? LEVEL[level] : 10;
	}

	const _msg = msg || '';
	const q = 'INSERT INTO logMessages (logTime, logLevel, logMessage) VALUES (?, ?, ?)';
	const v = [_time, _level, _msg];

	return poolQuery( q, v );
};

db.all = () => {
	return new Promise( ( resolve, reject ) => {
		pool.query( `
		select s.serviceName, r.lastUpdated, r.nextService, r.lastService
		from smart_home.recycleschedule r
		inner join
		( select serviceNameId, max(lastUpdated) as maxUpdated
			from smart_home.recycleschedule
			group by serviceNameId ) as grouped
		on r.serviceNameId = grouped.serviceNameId
		join smart_home.servicenames s
		on r.serviceNameId = s.id
		and r.lastUpdated = grouped.maxUpdated
		`, ( err, results ) => {
			if ( err ) {
				return reject( err );
			}

			return resolve( results );
		});
	});
};

db.saveIconUsage = ( icon ) => {
	const c = new Date();
	const format = `${c.getFullYear()}-${c.getMonth() + 1}-${c.getDate()} ${c.toLocaleTimeString( 'en-GB', { hour12: false })}`;

	return new Promise( ( resolve, reject ) => {
		pool.query( 'INSERT INTO weatherIconStats (date, icon) VALUES (?, ?)',
			[format, icon]
			, ( err, results ) => {
				if ( err ) {
					return reject( err );
				}

				return resolve( `Row ${results.insertId} added` );
			});
	});
};

module.exports = db;
