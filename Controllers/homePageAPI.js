var express = require('express');
var router = express.Router();
var homePage = require('../Models/homePage')

router.get('/', homePage.cb0);

module.exports = { router };