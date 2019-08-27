var express = require('express');
var user = require('../Models/user')

var router = express.Router();
router.get('/register', [user.checkUserDoesntAlreadyExist]);

module.exports = { router };