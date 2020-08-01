require('dotenv').config();

const path = require('path');

module.exports = {
    development: {
        sitename: 'PMM [dev]',
        database:{ dsn: process.env.DEVELOPMENT_DB_DSN }
    }, 
    production: {
        sitename: 'PMM',
        database:{ dsn: process.env.PRODUCTION_DB_DSN }

    },
    test: {
        sitename: 'PMM [test]',
        database:{ dsn: process.env.TEST_DB_DSN }
    }
}