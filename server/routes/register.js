var express = require('express');
var router  = express.Router();
var User = require('../models/user');

router.post('/', function(req, res){
  	var entry = new User({
  		username: req.body.username,
      password: req.body.password,
    	name: req.body.name,
    	lastName: req.body.lastName,
    	email: req.body.email
  	});

  	entry.save(function(err){
  		 if (err) {
            console.log(err);
            res.status(500).send('An error has occured');
        }

  		res.status(200).send("User " + req.body.username + " has been registered");
  	});
});

module.exports = router;
