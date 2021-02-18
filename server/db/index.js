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
		select 
			s.serviceName,
			max(r.lastUpdated) lastUpdated , 
			r.lastService,
			r.nextService 
		from 
			recycleschedule r
		join servicenames s
		on 
		r.serviceNameId = s.id
		group by 
		s.serviceName 
		`, (err, results) => {
			if (err) {
				return reject(err);
			}

			return resolve(results);
		})
	})
}

module.exports = mydb;