
var User = require('../../models/user');

exports.registerUser = function(req, res){
  console.log(req.body.newUser);

  var entry = new User({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        interests: req.body.interests
  });

  entry.save(function(err){
    if (err) {
        console.log(err);
        return;
    }

    res.end("user has been created");

  });
};

exports.checkUsername = function(req, res){
  
  var username = req.query.username;
  console.log(username);

  User.findOne({username:  username}, function(err, doc){
    if(err){
      console.log(error);
      return;
    }
    if(!doc){
      return;
    }
    if(doc){
      res.end("username taken!");
    }
  });
};