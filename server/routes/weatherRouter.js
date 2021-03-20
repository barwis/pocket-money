const express = require('express');
const axios = require('axios').default;
const router = express.Router();
const CITY_ID = 2640894;
const path = require('path');

const API_KEY = '26efb221a2f9817478b432238d322e3d';
// const API_ENDPOINT = `api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&appid=${API_KEY}`;

const API_ENDPOINT = 'http://api.weatherapi.com/v1/current.json?key=69466ae5b9a04898bb3193451211902&q=Orpington'
const API_ENDPOINT2 = 'http://api.weatherapi.com/v1/current.json?key=69466ae5b9a04898bb3193451211902&q=Orpington&aqi=no';

router.get('/', async (req, res, next) => {
	try {
		const response = await axios.get(API_ENDPOINT2);
		const r = response.data;
		const data = {
			location: {
				name: r.location.name,
				country: r.location.country
			},
			current: {
				condition: {
					icon: path.parse(r.current.condition.icon).name,
					text: r.current.condition.text
				},
				temp_c: r.current.temp_c,
				feelslike_c: r.current.feelslike_c,
				wind_kph: r.current.wind_kph,
				humidity: r.current.humidity,
				precip_mm: r.current.precip_mm,
				pressure_mb: r.current.pressure_mb
			}
		}
		
		res.status(200).json(data)

	} catch (error) {
		res.sendStatus(500);
	}
});




module.exports = router;
