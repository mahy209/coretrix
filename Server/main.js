#!/bin/bash node
// high resolution time measurement
// turn off that hard disk indexing thing for mongo
//TODO deploy to mlab for the sake of the prototype
const http = require('http');
const fs = require('fs');
/*var https = require('https');
var privateKey = fs.readFileSync('sslcert/new/localhost.key').toString();
var certificate = fs.readFileSync('sslcert/new/localhost.cert').toString();
console.log(privateKey);
var credentials = {
    key: privateKey,
    cert: certificate,
    requestCert: false,
    rejectUnauthorized: false
};*/
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const express = require('express');
var secure = require('express-force-https');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const api = require(path.join(__dirname, 'routers/api'));
const www = require(path.join(__dirname, 'routers/www'));
const date = require("./library").jsDate;

var app = express();

process.on('uncaughtException', function (err) {
    SaveError(err);
});

function SaveError(err) {
    var d = date();
    console.error("Error caught on: " + d);
    if (err) {
        if (err.err) err = err.err;
        //TODO debugging only
        console.log(err.message);
        console.log(err.stack);
    }
    try {
        fs.writeFile(__dirname + "/errors/" + d, arguments.callee.caller.toString() + "\n" + err.message + "\n" + ((err) ? err.stack : "null"), () => { })
    } catch (e) {
        console.log("Unable to save error file !");
        console.error(e.stack);
        console.log("The Error:");
        console.error(arguments.callee.caller.toString() + "\n" + err.message + "\n" + ((err) ? err.stack : "null"));
    }
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);

try {
    if (fs.readFileSync('current_database').toString().substr(0, 4) == 'live') {
        app.use(secure);
    }
} catch (e) { }

app.use(bodyParser.text());
app.use(bodyParser.raw());

app.use(cors());
app.options('*', cors());

app.use('/api', api);
app.use('/', www);
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));

app.get('/favicon', function (req, res) {
    //TODO res.sendFile('favico.png');
    res.end();
})

app.use(function (req, res) {
    res.render('404.html');
})

app.use(function (err, req, res, next) {
    SaveError({
        err: err,
        res: res
    });
});

var httpServer = http.createServer(app);
var server = httpServer.listen({
    host: ip,
    port: port
}, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Magic happens on port %s. Have a great time with the magician %s", port, host);
});
