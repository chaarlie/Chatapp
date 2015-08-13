#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app = express();
var http = require('http');

app.set('port',  process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 80);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');


app.use(express.static(__dirname + '/public')); 

var server = http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


app.get('/',function(req, res){
    res.setHeader('Content-Type', 'text/html'); 
    res.send(fs.readFileSync('index.html'));
});