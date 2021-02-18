const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const createError = require('http-errors');

const router = require('./routes');


module.exports = (config) => {
    const app = express()
    const port = 5000;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    if (app.get('env') === 'development') {
        app.locals.pretty = true;
    }

	app.use('/', router);

    // use routes
    app.get('/health', (req, res) => res.status(200).send({ status: 'OK' }));
    app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

    return app;
}
