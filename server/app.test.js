
// const http = require('http');
// const config = require('../config')[process.env.NODE_ENV || 'development'];
// const app = require('../app')(config);


var express = require('express');
let chai = require('chai');
let chaiHttp = require('chai-http');

const config = require('./config')[process.env.NODE_ENV || 'development'];
const app = require('./app')(config);

chai.use(chaiHttp);

describe('APP routes', () => {
    it('should call /health', () => {
        chai.request(app)
        .get('/health')
        .end((err, res) => {
            res.should.have.status(200);
        });
    })
})
