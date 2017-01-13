var express = require('express');
var controller = require('./login.controller');
var router = express.Router();

router.post('/', controller.login);
router.get('/test', controller.verifyAuth);

module.exports = router;