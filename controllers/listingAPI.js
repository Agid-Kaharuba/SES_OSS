const express = require('express');
const router = express.Router();
const listingModel = require('../models/listing');
const userModel = require('../models/user')
const baseView = require('../views/base')
const view = require('../views/listingView');
const jsonResponse = require('../utils/JSONResponse');
const htmlResponse = require('../utils/HTMLResponse');
const attachmentUtil = require('../utils/attachmentUtil');
const auth = require('../utils/authUtil');

// Every method is prepended with "/listing" see app.js

router.get('/id=:id', (req, res) => // e.g. listing/id=4bb8590e-ce26-11e9-a859-256794b0b57d
{
	console.log('Receieved req for listing id: ' + req.params.id); // Example params usage.

	listingModel.GetListing(req.params.id,
	{
		found: (result) => 
		{
			result[0].imgName = attachmentUtil.getImgPath(result[0].imgName);
			baseView.renderWithAddons(req, res, 'pages/listingResult', {result});
		},
		notFound: () => { htmlResponse.fail(req, res, "Could not find the listing that you were looking for :(", "Listing not found"); }
  });
});



router.get('/search=:query', (req, res) => 
{
	console.log('Received search query: ' + req.params.query); // Example params usage.
	
	listingModel.SearchListings(req.params.query, 
		(results) =>
		{
			for (var i = 0; i < results.length; i++)
			{
				results[i].imgName = attachmentUtil.getImgPath(results[i].imgName);
			}
			baseView.renderWithAddons(req, res, 'pages/listing', {listings: results });
		});
})

router.get('/summary=:purchaseID', auth.authorizeUser, (req, res) =>
{
	console.log('Received request to see purchase summary.')
	auth.getSessionFromCookie(req, 
	{
		found: (session) =>
		{
			var userPK = session.SS_US;
			listingModel.GetPurchaseSummary(req.params.purchaseID, userPK, 		
			{
				found: 
					(result) => 
					{
						console.log(result);
						res.render(view.viewPurchaseSummary(result));
					},
				notFound: 
					() => htmlResponse.fail(req, res, 'Could not get your purchase summary :(', 'Payment Summary Not Found'),
			});
		},
		notFound: () => htmlResponse.fail(req, res, 'Could not get your session ID', 'Session Failure.'),
	});
});

router.get('/purchase=:listingID&quantity=:amount', (req, res) => 
{
	console.log(req.params.listingID+ "|" + req.params.amount);
	auth.getSessionFromCookie(req, 
	{
		found: (session) =>
		{
			var userPK = session.SS_US;
			listingModel.getPrePurchaseInformation(userPK, req.params.listingID, req.params.amount,
			{
				success: (purchaseInfo) => 
				{
					//pass this onto the view.
				},
				fail: () => { }
			});
		},
		notFound: () => { }
	});
});

router.post('/purchaseItem', (req, res) => 
{
	console.log(req);
	listingModel.purchaseItem(
		req.params.listingPK, 
		req.params.buyerPK, 
		req.params.paymentMethodPK, 
		req.params.deliveryAddressPK, 
		totalPrice, 
		quantity,
	{
		success: (purchasePK) =>
		{
			res.redirect("/summary=" + purchasePK);
		},
		fail: (reason) => { res.send(jsonResponse.fail(reason)); }
	})
});

router.get('/confirmPurchase', (req, res) =>
{
	let currentUser = req.cookies.currentUser;
	console.log('currentUser is ' + currentUser);
	baseView.renderWithAddons(req, res, 'pages/confirmPurchase', { currentUser })
});

router.get('/paymentSummary', auth.authorizeUser, (req, res) =>
{
	baseView.renderWithAddons(req, res, 'pages/paymentSummary');
});

router.get('/listing/');

module.exports = { router };