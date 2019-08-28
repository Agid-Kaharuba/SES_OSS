const express = require('express');
const homePage = require('../models/homePage')

const router = express.Router();

router.get('/', homePage.cb0);

module.exports = { router };