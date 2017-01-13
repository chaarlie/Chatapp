var User = require('../models/user');
var fs   = require('fs');

var socket;

var eventEmitter = require('../events/eventEmitter');
var users = {};


module.exports = function (io, session) {

   eventEmitter.on('login', function(username){
    if(!users.hasOwnProperty(username)  ){
        console.log("inside the socket");
        users[username] = socket;
          
    }

    setTimeout(function () {
      var welcomeInstructions = 
      'Welcome! \n'+
      '-.This is an instant messaging app \n'+
      '-.Hover over the pic to upload a new one \n'+
      '-.To chat: \n'+
      '1)Open a new browser/incognito session \n2)Choose another user';

      io.emit('allConnected', Object.keys(users));         
      socket.emit('msgFromServer', { "from": "Bot", "to": "", "message": welcomeInstructions});
    }, 1000);
  });
 
  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  }

  io.sockets.on('connection', function (s) {
    socket = s;

    s.on('msgToServer', function(data){
      console.log(data);
      if(data.from !== 'Bot' && users[data.to])
        users[data.to].emit('msgFromServer', { from: data['from'], to: data['to'], message: data['message']});
    });

    s.on('disconnect', function() {
      console.log("inside disconnect");
      console.log(Object.keys(users));
      io.emit('allConnected', Object.keys(users));
    });
  });

   
/*    socket.on('createUser', function(user){
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

*/

}