var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');

var prepareDB = require('./helper/prepareDB');



var app = express();

var cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.SQL_PREPARE_DB) {
    prepareDB();
}

const routes = [
    { path: '/config', file: './routes/config' },
    { path: '/login', file: './routes/login' },
    { path: '/device', file: './routes/device' },
    { path: '/location', file: './routes/location' },
    { path: '/person', file: './routes/person' },
    { path: '/user', file: './routes/user' },
];

routes.forEach(route => {
    app.use(route.path, require(route.file));
});

module.exports = app;