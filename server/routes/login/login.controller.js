
var User = require('../../models/user');

var eventEmitter = require('../../events/eventEmitter');

exports.login = function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username:  username, password:  password}, function(err, doc){

          if(err){
            console.log(err);
          }

          if(!doc){
            res.end("Invalid credentials");
          }

          else{
            var session = req.session;
            session.username = username;          
            eventEmitter.emit('login', username)
            res.json({id:session.id, username:username});
        }
  });
};

exports.verifyAuth = function(req, res){
  var session = req.session;
  res.json({id:session.id, username: session.username});
};