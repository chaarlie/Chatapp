var User = require('../models/user');
var fs   = require('fs');


module.exports = function (io, ss, session) {

  session.sids = [];
  var users = {};
  var connected = {};

  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  }

  io.sockets.on('connection', function (socket) {
    socket.on('userLogin', function(data) {
      
      User.findOne({username: data['username'], password: data['password'] }, function(err, doc){

        if(!users.hasOwnProperty(data["username"]) && data["username"]){
            users[data.username] = socket;
          }

        if(err){
          console.log(err);
        }

        if(!doc){
          socket.emit('sockid', null);
        }

        else{
        
          session.user = data["username"];

          socket.emit('sockid', socket.id );

          setTimeout(function () {
            var welcomeInstructions = 
            'Welcome! \n'+
            '-.This is an instant messaging app \n'+
            '-.Hover over the pic to upload a new one \n'+
            '-.To chat: \n'+
            '1)Open a new browser/incognito session \n2)Choose another user';

            //console.log("inside login");
            //console.log(Object.keys(users));
            io.emit('allConnected', Object.keys(users));         
            socket.emit('msgFromServer', { "from": "Bot", "to": "", "message": welcomeInstructions});
          }, 1000);
             
        }
      });

    });

    socket.on('createUser', function(user){
      var entry = new User({
        username: user.username,
        password: user.password,
        name: user.name,
        lastName: user.lastName,
        email: user.email
      });

      entry.save(function(err){
         if (err) {
              console.log(err);
              return;
          }
          socket.emit('newUserCreated', user.username);
      });
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
      
      console.log("inside disconnect");
      console.log(Object.keys(users));
      io.emit('allConnected', Object.keys(users));
    });

    ss(socket).on('file', function(stream, data) {
      //error handling en stream == null

      var dir = 'client/files/';

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      stream.pipe(fs.createWriteStream(dir + data.name));
    });

  });

}