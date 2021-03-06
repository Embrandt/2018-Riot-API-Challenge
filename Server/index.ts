// var express = require('express')
// var app = express()
// var mysql = require('mysql');

import * as mysql from 'mysql';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as dotenv from 'dotenv';
// TODO Refactor database to use more fucking logical ids
dotenv.config({path: `${__dirname}/.env`});
var https = require('https');
import { setup as missionSetup } from './routes/missions';
import { setup as playerSetup } from './routes/player';
import { setup as leaderboardSetup } from './routes/leaderboard';
import { setup as warSetup } from './routes/wars';

import { SQL } from './sql_functions';

var app = express();
// Configure app
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json())
// Connect to mysql
var conn = mysql.createConnection({
    host: "riot-2018.chwqb24onmqi.ca-central-1.rds.amazonaws.com",
    user: "root",
    password: "password",
    database: "riot-2018"
});

app.use(function (request, response, next) {
    // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.header("Access-Control-Allow-Headers", "Origin, XRequested-With, Content-Type, Accept ");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS ');
    next();
});

// respond with "hello world" when a GET request is made to the homepage
app.route("/").get((req, res) => {
    res.send('hello world');
});

// Connect to database
conn.connect((err) => {
    if(err) throw err;
    console.log("Connection to database established");

    var SQLData:SQL = createSQL();
    initializeRoutes(SQLData);

    app.listen(1000);
    // var server = https.createServer(app).listen(1000, function() {
    //     console.log('Https App started');
    // });
    console.log("Listening on port 1000");
});

function initializeRoutes(SQLData:SQL) {
    // Setup paths
    missionSetup(app, SQLData);
    playerSetup(app, SQLData);
    leaderboardSetup(app, SQLData);
    warSetup(app, SQLData);
}

function createSQL():SQL {
    return new SQL(conn);
}