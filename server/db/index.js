const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: 'VenCeym3',
	database: 'smart_home',
})

let mydb = {};

mydb.all  = () => {
	return new Promise((resolve, reject) => {
		pool.query(`
		select s.serviceName, r.lastUpdated, r.nextService
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