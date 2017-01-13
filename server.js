var http = require('http');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');  
 
app.set('port',  process.env.OPENSHIFT_NODEJS_PORT  || 80);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');


var server = http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io')(server); 
 
var database = require('./server/config/database');


var index = require('./server/routes/index');
var interests = require('./server/routes/interests/index');
var login = require('./server/routes/login/index');
var register = require('./server/routes/register/index');

app.use(cookieParser());
app.use(session({
 secret: 'Aguacacate', cookie: { maxAge : 1200000 }, 
  httpOnly: true,
  secure: true,
  resave: true,
  saveUninitialized: true
}));
 
app.use(express.static(__dirname + '/client'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', index);
app.use('/api/login', login);
app.use('/api/interests', interests);
app.use('/api/register', register);
 
mongoose.connect(database.url); 

require('./server/socket/socket')(io, session); 
