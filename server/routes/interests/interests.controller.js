
var Interests = require('../../models/interest');

exports.findAll = function(req, res){

  Interests.find({}, {'name':1 , 'count': 1, '_id': 0}, function(err, interest){

    if(err){
      console.log(err);
    }

    if(!interest){
      res.end("An error has ocurred!");
    }

    else{
      res.json(interest);    
    }
  });
}