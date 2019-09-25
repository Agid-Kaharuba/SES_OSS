const express = require('express');
const homePage = require('../models/homePage')
const view = require('../views/homePageView');
const router = express.Router();

router.get('/', (req, res) =>
{
	console.log("Receieved req for homePage listings");
	homePage.GetRecentListings(
		(err, results) =>
		{ 
			if (err) throw err;
			res.sendFile(view.viewHomePage(results));
		});
});

router.get('confirmPurchase', (req, res) =>
{
	res.render('confirmPurchase');

}); 

module.exports = { router };
