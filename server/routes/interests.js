var express = require('express');
var router  = express.Router();

router.get('/', function(req,res){
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

  	res.json(interests);
  	res.end();
});

module.exports = router;