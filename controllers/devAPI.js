const express = require('express');
const router = express.Router();
const dev = require('../models/dev')

// Every method is prepended with "/dev" see app.js

router.get('/createSchema', (req, res) => 
{
	dev.createSchema();
	res.send("Schema dropped, and re-created - if there were any errors, let David know")
})

router.get('/populateDatabase', (req, res) => 
{
	dev.populateDatabase();
	res.send("Database populated, if there were any errors, try recreating the schema @ /dev/createSchema");
})

module.exports = { router };