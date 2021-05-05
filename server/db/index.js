let dbmodule;

try {
	const mysql = require('mysql');
	dbmodule = mysql;
} catch {
	const mariadb = require('mariadb');
	dbmodule = mariadb;
}
const pool = dbmodule.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: 'smart_home',
})

let mydb = {};

mydb.all  = () => {
	return new Promise((resolve, reject) => {
		pool.query(`
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
		`, (err, results) => {
			if (err) {
				return reject(err);
			}

			return resolve(results);
		})
	})
}

module.exports = mydb;
