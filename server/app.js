const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const createError = require('http-errors');

var cors = require('cors')

const recycleScheduleRouter = require('./APIs/recycleScheduleRouter');
const weatherApiRouter = require('./APIs/weatherRouter');
const googleRouter = require('./APIs/googleCalendar');

module.exports = (config) => {
    const app = express()
	app.use(cors())

    const port = 5000;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    if (app.get('env') === 'development') {
        app.locals.pretty = true;
    }

    // use routes
    app.get('/health', (req, res) => res.status(200).send({ status: 'OK' }));

	app.use('/recycle', recycleScheduleRouter);
	app.use('/weather', weatherApiRouter);
	app.use('/calendar', googleRouter);

    app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

    return app;
}
