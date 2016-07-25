var express = require('express');
var fs      = require('fs');
var router  = express.Router();

router.get('/',function(req, res){
  res.setHeader('Content-Type', 'text/html');
  res.send(fs.readFileSync('index.html'));
});

module.exports = router;