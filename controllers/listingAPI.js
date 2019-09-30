const express = require('express');
const router = express.Router();
const listingModel = require('../models/listing');
const view = require('../views/listingView');
const jsonResponse = require('../utils/JSONResponse');
// Every method is prepended with "/listing" see app.js

router.get('/id=:id', (req, res) => // e.g. listing/id=4bb8590e-ce26-11e9-a859-256794b0b57d
{
	console.log('Receieved req for listing id: ' + req.params.id); // Example params usage.
	listingModel.GetListing(req.params.id,
		(result) => {
			// 	res.send(.viewListing(result));
			// let currentSearch = 

			res.render('pages/listingResult', {result});
			// listingModel.SearchListings({listings: listingID});
			// res.send(listingModel.SearchListings(listingID));
			// res.render('pages/listingResult', {result[req.params.id].sellerUsername});
			// res.renderWith(view.viewListing(result)); 
			// res.send(controller.SearchListings(result));
		});
});



router.get('/search=:query', (req, res) => 
{
	console.log('Received search query: ' + req.params.query); // Example params usage.
	listingModel.SearchListings(req.params.query, 
		(results) =>
		{ 
			
			res.render('pages/listing', { listings: results });
		});
})

router.get('/summary=:purchaseID', (req, res) =>
{
	console.log('Received request to see purchase summary.')
	var userPK = "This needs to be set as the user PK defined by the session."; //and pass it through to the 'GetPurchaseSummary' such that a user cannot see another users purchase summaries
	listingModel.GetPurchaseSummary(req.params.purchaseID, userPK, 		
		{
		found: 
			(result) => 
			{
				console.log(result);
				res.render(view.viewPurchaseSummary(result));
			},
		notFound: 
			() => res.send(jsonResponse.fail("Payment Summary Not Found")),
		})
});

router.get('/confirmPurchase', (req, res) =>
{
	res.render('pages/confirmPurchase')
});

router.get('/paymentSummary', (req, res) =>
{
	res.render('pages/paymentSummary')
	router.get('/listing/Search=',function(req,res){
		ejs.renderFile('pages/listing', {listing : listings}); 
	});
});



router.get('/listing/');



module.exports = { router };
			
