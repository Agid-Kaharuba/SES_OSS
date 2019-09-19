const express = require('express');
const router = express.Router();
const listingModel = require('../models/listing');
const view = require('../views/listingView');

// Every method is prepended with "/listing" see app.js

router.get('/id=:id', (req, res) => // e.g. listing/id=4bb8590e-ce26-11e9-a859-256794b0b57d
{
	console.log('Receieved req for listing id: ' + req.params.id); // Example params usage.
	listingModel.GetListing(req.params.id, 
		(err, results) =>
		{ 
			if (err) throw err;
			res.send(view.viewListing(results));
		});
});

router.get('/search=:query', (req, res) => 
{
	console.log('Received search query: ' + req.params.query); // Example params usage.
	listingModel.SearchListings(req.params.query, 
		(err, results) =>
		{ 
			if (err) throw err;
			res.send(view.viewListings(results));
		});
});

router.get('/summary=:purchaseID', (req, res) =>
{
	console.log('Received request to see purchase summary.')
	var userPK = "We have to retrieve the user PK from the session"; //and pass it through to the 'GetPurchaseSummary' such that a user cannot see another users purchase summaries
	listingModel.GetPurchaseSummary(req.params.purchaseID, userPK, 		
		{
		found: 
			(result) => 
			{
				console.log(result);
				res.send(jsonResponse.success());
			},
		notFound: 
			() => res.send(jsonResponse.fail("Payment Summary Not Found")),
		})
});

module.exports = { router };