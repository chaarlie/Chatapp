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
//var interests = ['chat','fotos', 'chicas', 'chicos', 'musica', 'salir', 'bailar'];

var interests = [
  {name: 'chat', count: 1},
  {name: 'fotos', count: 1},
  {name: 'chicas', count: 1},
  {name: 'chicos', count: 1},
  {name: 'musica', count: 1},
  {name: 'salir', count: 1},
  {name: 'bailar', count: 1},
  {name: 'ropa', count: 1},
  {name: 'viajes', count: 1}

];

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

io.sockets.on('connection', function (socket) {
  socket.on('userLogin', function(data) {
    if(users.indexOf(data["username"]) == -1 )
      users[data.username] = socket;
    
    session.user = data["username"];

    
    //io.emit('interest-list', interests);

    setTimeout(function () {
      var welcomeInstructions = 
        '¡Bienvenido! \n'+
        '-.Esta es una aplicación de chat \n'+
        '-.Mover el puntero sobre la foto para cambiarla \n'+
        '-.Para chatear: \n'+
        '1)abra otro explorador \n2)elija otro usuario';

        io.emit('allConnected', Object.keys(users));         
        socket.emit('msgFromServer', { "from": "Bot", "to": "", "message": welcomeInstructions});

    }, 1000);
  });

  socket.on('displayReadyClient', function(data){
    socket.emit('allConnected', Object.keys(users));
  });

  socket.on('interestSearch', function(interest){
    var found = [];

    for(var i in interests){

      if(typeof interests[i].name === "string"){
        //console.log(interests[i].indexOf(interest));
        if(interests[i].name.startsWith(interest)){
          found.push(interests[i]);
        }
      }
      else
        break;
    }
    socket.emit('interestResult', found);
  });

  socket.on('interestAdd', function(interest){
    for(var i in interests){
      if(interests[i].name === interest){
        interests[i].count++;
        io.emit('interestList', interests);

        break;
      }
    }
  });

  socket.on('interestAddNew', function(interest){
    interests.push({name:interest, count:1});
    io.emit('interestList', interests);
  });

  socket.on('interestDel', function(interest){
    for(var i in interests){
      if(interests[i].name === interest){
        if( interests[i].count > 1){
          interests[i].count--;
          io.emit('interestList', interests);

          break;
        }
      }
    }
  });

  socket.on('msgToServer', function(data){
    //console.log(data);
    if(data.from !== 'Bot' && users[data.to])
      users[data.to].emit('msgFromServer', { from: data['from'], to: data['to'], message: data['message']});
  });

  socket.on('disconnect', function() {
    delete users[session.user];
    //console.log(Object.keys(users));
    io.emit('allConnected', Object.keys(users));
  });

  ss(socket).on('file', function(stream, data) {
    //error handling en stream == null

    var dir = 'public/files/';

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

app.get('/get_interests', function(req,res){
  res.json(interests);
  res.end();
});