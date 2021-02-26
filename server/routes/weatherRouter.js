const express = require('express');
const axios = require('axios').default;
const router = express.Router();
const CITY_ID = 2640894;

const API_KEY = '26efb221a2f9817478b432238d322e3d';
// const API_ENDPOINT = `api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&appid=${API_KEY}`;

const API_ENDPOINT = 'http://api.weatherapi.com/v1/current.json?key=69466ae5b9a04898bb3193451211902&q=Orpington'
const API_ENDPOINT2 = 'http://api.weatherapi.com/v1/current.json?key=69466ae5b9a04898bb3193451211902&q=Orpington&aqi=no';
// api.openweathermap.org/data/2.5/forecast/daily?q=Orpington&cnt=7&appid=69466ae5b9a04898bb3193451211902
/**
 * to find city id run this in powershell
 * select-string -pattern "Orpington" -path "C:/city.list.json" -Context 5,5
 */

// `api.openweathermap.org/data/2.5/weather?id=2640894&appid=26efb221a2f9817478b432238d322e3d`

// const instance = axios.create({
// 	baseURL: "API_ENDPOINT",
// 	timeout: 1000,
// });

router.get('/', async (req, res, next) => {
	try {
		const response = await axios.get(API_ENDPOINT2);
		res.status(200).json(response.data)
		// setTimeout(() => res.status(200).json(response.data), 2000);

	} catch (error) {
		res.sendStatus(500);
	}
});




module.exports = router;
