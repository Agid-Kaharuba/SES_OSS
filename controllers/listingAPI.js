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
			res.send(view.viewListing(result));
		});
});


let results = [
	{ sellerUsername: '2132', listingTitle: 'SQL', listingDescription: 'Test Description123', remainingStock: '3', sellerPrice:'23.40'},
	{ sellerUsername: '2132', listingTitle: 'MY123', listingDescription: 'Test Description123', remainingStock: '3', sellerPrice:'23.40' },
	{ sellerUsername: '2132', listingTitle: 'Communison', listingDescription: 'Test Description123', remainingStock: '3', sellerPrice:'23.40' },		
	{ sellerUsername: '21321321', listingTitle: '123', listingDescription: 'Test Description123', remainingStock: '3213213213', sellerPrice:'23.40' },
	{ sellerUsername: 'hello world', listingTitle: 'HELLO WORLD', listingDescription: 'Test Description123', remainingStock: 'JELLO', sellerPrice:'23.40' }
];

router.get('/search=:query', (req, res) => 
{
	console.log('Received search query: ' + req.params.query); // Example params usage.
	// listing.SearchListings(req.params.query, 
	// 	(err, resu lts) =>
	// 	{ 
	// 		if (err) throw err;
	// 		res.send(view.viewListings(results))s;
	// 	});

	// res.send(view.viewListings(results));
	res.render('listing', { listings: results });
})

router.get('/listing.listingTitle', (req, res) => 
{
	console.log('Received search query: ' + req.params.query); // Example params usage.
	// listing.SearchListings(req.params.query, 
	// 	(err, resu lts) =>
	// 	{ 
	// 		if (err) throw err;
	// 		res.send(view.viewListings(results))s;
	// 	});

	// res.send(view.viewListings(results));
	res.render('listingResult', { listings: results });
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
});

// router.get('/listings/confirmPurchase',function(req,res){
//     ejs.renderFile('confirmPurchase'); 
// });

router.get('/listing/Search=',function(req,res){
    ejs.renderFile('listing', {listing : listings}); 
});


function search(namekey, results){
	for (var i = 0; i < results.length; i++){
		if (results[i].listingTitle == namekey){
			return results[i]; 
		}
	} 
} 


router.get('listing.listingTitle',function(req,res){

	// if (results[i].listingTitle == )
	ejs.renderFile('listingResult', {listing : search(listings)}); 

});


router.get('/listing/');

router.get('listing/listingResult');


module.exports = { router };
