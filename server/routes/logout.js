var express = require('express');
var router  = express.Router();

router.get('/',function(req,res){
  session.user = null;
});

module.exports = router;
