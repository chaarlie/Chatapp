
var express = require('express');
var controller = require('./interests.controller');
var router = express.Router();

router.get('/', controller.findAll);

module.exports = router;