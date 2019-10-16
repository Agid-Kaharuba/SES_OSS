const express = require('express');
const router = express.Router();
const listingModel = require('../models/listing');
const userModel = require('../models/user')
const baseView = require('../views/base')
const jsonResponse = require('../utils/JSONResponse');
const htmlResponse = require('../utils/HTMLResponse');
const attachmentUtil = require('../utils/attachmentUtil');
const auth = require('../utils/authUtil');

// Every method is prepended with "/listing" see app.js

router.get('/id=:id', (req, res) => // e.g. listing/id=4bb8590e-ce26-11e9-a859-256794b0b57d
{
	listingModel.GetListing(req.params.id,
	{
		found: (listings) => 
		{
			if (listings.length < 1) 
			{
				htmlResponse.fail(req, res, "Could not find the listing that you were looking for :(", "Listing not found");
			}
			else 
			{
				userModel.getUserInfo(req, (user, isAdmin) =>
				{
					let listing = listings[0];
					listing.listingImg = attachmentUtil.getImgPath(listing.listingID);

					if (isAdmin || user.id == listing.sellerID)
					{
						listingModel.getPurchasesForListing(listing, 
						{
							success: (purchases) => baseView.renderFromInfo(req, res, 'pages/listingResult', {user, isAdmin, listing, purchases}),
							fail: (reason) => htmlResponse.fail(req, res, reason, "Failed to get purchases for listing!")
						})
					}
					else
					{
						baseView.renderWithAddons(req, res, 'pages/listingResult', {user, isAdmin, listing});
					}
				})
			}
		},
		notFound: () => { htmlResponse.fail(req, res, "Failed to get the listing that you were looking for :(", "Listing Fetch Failure"); }
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
                results[i].listingImg = attachmentUtil.getImgPath(results[i].listingID);
			}
			console.log(results);
            baseView.renderWithAddons(req, res, 'pages/listing', { listings: results });
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
                        baseView.renderWithAddons(req, res, 'pages/purchaseSummary', {result});
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
    console.log(req.params.listingID + "|" + req.params.amount);
    auth.getSessionFromCookie(req, 
        {
        found: (session) => 
        {
            var userPK = session.SS_US;

            listingModel.getPrePurchaseInformation(userPK, req.params.listingID, req.params.amount, 
                {
                success: (purchase) => 
                {
                    baseView.renderWithAddons(req, res, 'pages/purchase', { purchase });
                },
                fail: () => htmlResponse.fail(req, res, 'Could not get your purchase :(', 'Payment Not Found'),
            });
        },
        notFound: () => htmlResponse.fail(req, res, 'Could not get your session ID', 'Session Failure.'),
    });
});


router.post('/purchaseItem', (req, res) => 
{
    console.log(req);
    listingModel.purchaseItem(
        req.body, {
            success: (purchaseID) => {
                res.send(jsonResponse.success({ purchaseID }));
            },
            fail: (reason) => { res.send(jsonResponse.fail(reason)); }
        })
});

router.post('/modify', (req, res) => 
{
    userModel.getUserInfo(req, (user, isAdmin) => 
    {
        let listing = req.body;

        if (!Object.prototype.hasOwnProperty.call(listing, 'id')) 
        {
            res.send(jsonResponse.fail("Failed to modify a listing with no id property!"));
            return;
        }

        if (isAdmin || user.id == listing.id) 
        {
            listingModel.modifyListing(listing, 
            {
                success: () => res.send(jsonResponse.success()),
                fail: (reason) => res.send(jsonResponse.fail(reason))
            })
        }
    })
})

module.exports = { router }