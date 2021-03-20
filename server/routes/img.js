const express = require('express');
const db = require('../db/index');
const axios = require('axios').default;

const router = express.Router();

router.get('/health', (req, res, next) => {
	res.status(200).json({status: 'ok'});
})

router.get(['/img/*/:fallback/:image'], async (req, res, next) => {
	const imgRoute = req.params[0];
	const filename = req.params.image.split('.');
	if ( filename.length !== 3) 
		res.sendStatus(400)
	
	const fallbackUrl = req.params.fallback; // map into object for readability?
	
	const imgUrl = `${req.protocol}://${req.hostname}:3000/${imgRoute}/${filename[0]}.${filename[1]}`;
	console.log(imgUrl);
	const fallbacImagekUrl = `${req.protocol}://${req.hostname}:3000/${imgRoute}/${fallbackUrl}/${filename[0]}.${filename[2]}`;

	try {
		const response = await axios.get(imgUrl, { method: 'HEAD'});
		res.json( { url: imgUrl });
	} catch {
		try {
			const response = await axios.get(fallbacImagekUrl, { method: 'HEAD'});
			res.json({url: fallbacImagekUrl} );

		} catch {
			res.sendStatus(404)
		}
	}
});

module.exports = router;
