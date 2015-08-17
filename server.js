var http = require('http');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs      = require('fs');

app.set('port',  process.env.OPENSHIFT_NODEJS_PORT  || 80);
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
app.use(bodyParser.json()); 

session.sids = [];
var users = [];
var connected = {};

io.sockets.on('connection', function (socket) {     
    socket.on('userLogin', function(data) {
        if(users.indexOf(data["username"]) == -1 )
            users[data.username] = socket;
        for (var u in users)
            connected[u] = {username: u};


        io.emit('allConnected', connected);

        var welcomeInstructions = [
            '¡Bienvenido!',
            '-.Esta es una aplicación de chat',
            '-.Para chatear:',
            '1)abra otro explorador \n 2)elija otro usuario'
         ];

        for(var index in welcomeInstructions){
               socket.emit('msgFromServer', { from: 'Bot', to: data.username, message: welcomeInstructions[index]});
        }
    });
    
    socket.on('msgToServer', function(data){    
        if(data.from !== 'Bot' && users[data.to])
            users[data.to].emit('msgFromServer', { from: data['from'], to: data['to'], message: data['message']});
    });

    socket.on('disconnect', function() {
      for(u in users){
         if(users[u].id == socket.id ){     
             delete connected[u];
             delete users[u];
             
             io.emit('allConnected', connected);

        }
    }

   });

  ss(socket).on('file', function(stream, data) {
    //error handling en stream == null

    var dir = 'files/';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    stream.pipe(fs.createWriteStream(dir + data.name));
  });

});

app.get('/',function(req, res){
    res.setHeader('Content-Type', 'text/html'); 
    res.send(fs.readFileSync('index.html'));
});

app.get('/logout',function(req,res){
    session.user = null;
});


app.post('/login',function(req,res){
    // validar usuario en la base de datos antes de introducir a la sesion.
    var dbTestedValidUser = true ;    

    if(dbTestedValidUser){
        if(req.body.username)
        if(!session.sids[req.body.username]){
            session.sids[req.body.username] =  req.sessionId; 
        }
    }
    res.json({sessionId: req.sessionID});
});
