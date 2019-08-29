const express = require('express');
const router = express.Router();
const dev = require('../models/dev')

// Every method is prepended with "/dev" see app.js

router.get('/createSchema', (req, res) => 
{
	res.send("Schema dropped, and created with " + dev.createSchema() + " errors.")
})

router.get('/search/:query', (req, res) => 
{
    console.log('Received query: ' + req.params.query); // Example params usage.
})

module.exports = { router };