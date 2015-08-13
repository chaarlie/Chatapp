#!/bin/env node
//  OpenShift sample Node application
var http = require('http');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs      = require('fs');


app.set('port',  process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 80);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');


var server = http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);   
var ss = require('socket.io-stream');
var path = require('path');

app.use(cookieParser());
app.use(session({
    secret: 'Agucacate',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/public')); 

var server = http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


app.get('/',function(req, res){
    res.setHeader('Content-Type', 'text/html'); 
    res.send(fs.readFileSync('index.html'));
});