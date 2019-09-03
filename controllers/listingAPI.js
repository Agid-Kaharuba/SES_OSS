const express = require('express');
const router = express.Router();
const listing = require('../models/listing');
const view = require('../views/listingView');

// Every method is prepended with "/listing" see app.js

router.get('/id=:id', (req, res) => // e.g. listing/id=4bb8590e-ce26-11e9-a859-256794b0b57d
{
	console.log('Receieved req for listing id: ' + req.params.id); // Example params usage.
	listing.GetListing(req.params.id, 
		(err, results) =>
		{ 
			if (err) throw err;
			console.log(results);
			res.send(view.viewListing(results));
		});
})

router.get('/search=:query', (req, res) => 
{
	console.log('Received search query: ' + req.params.query); // Example params usage.
	listing.SearchListings(req.params.query, 
		(err, results) =>
		{ 
			if (err) throw err;
			res.send(view.viewListings(results));
		});
})

module.exports = { router };