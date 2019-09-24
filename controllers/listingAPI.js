const express = require('express');
const router = express.Router();
const listing = require('../models/listing');
const view = require('../views/listingView');
// Every method is prepended with "/listing" see app.js
//uses jquery 
// app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

//app.use('/jquery', express.static(__dirname + '/jquery'));


router.get('/id=:id', (req, res) => // e.g. listing/id=4bb8590e-ce26-11e9-a859-256794b0b57d
{
	console.log('Receieved req for listing id: ' + req.params.id); // Example params usage.
	listing.GetListing(req.params.id, 
		(err, results) =>
		{ 
			if (err) throw err;
			res.send(view.viewListing(results));
		});
})


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



// router.get('/listings/Search=/listingResult',function(req,res){
//     ejs.renderFile('listingResult', {listing : listings}); 
// });


router.get('/listing/');

router.get('listing/listingResult');


module.exports = { router };