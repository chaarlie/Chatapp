var express = require('express');
var controller = require('./register.controller');
var router = express.Router();

router.post('/', controller.registerUser);
router.get('/check-username', controller.checkUsername);

module.exports = router;