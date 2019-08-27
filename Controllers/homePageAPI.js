var express = require('express');
var homePage = require('../Models/homePage')

var router = express.Router();
router.get('/', homePage.cb0);

module.exports = { router };