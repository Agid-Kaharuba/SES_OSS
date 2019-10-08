const express = require('express');
const baseView = require('../views/base')
const userModel = require('../models/user');
const jsonResponse = require('../utils/JSONResponse');
const auth = require('../utils/authUtil');
const router = express.Router();

// Every method is prepended with "/user" see app.js

router.post('/register', (req, res) =>
{
	var user = req.body;
	userModel.checkUserExists(user.username,
		{
			found: 
				() => res.send(jsonResponse.fail("Could not register an already existing user")),
			notFound: 
				() => userModel.registerUser(user,
				{
					success:
						() => res.redirect("/?register=success"),
					fail:
						(reason) => res.send(jsonResponse.fail(reason))
				})
		});
});

router.post('/login', (req, res) =>
{
	console.log(req.body);
	userModel.loginUser(req.body.username, req.body.password,
		{
			success:
				(user) => auth.attach(res, user,
				{
					success: () => 
					{
						res.cookie("currentUser", user.username);
						res.redirect("/?login=success");
					},
					fail: () => res.send(jsonResponse.fail('Failed to create a new session'))
				}),
			fail:
				(reason) => res.send(jsonResponse.fail(reason)),
		});
});

router.get('/profile', (req, res) => 
{
	baseView.renderWithAddons(req, res, 'pages/userDashboard/userProfileView');
});


router.get('/logout', (req, res) =>
{
	auth.invalidateSession(req, 
		{
			success: () => 
			{
				res.cookie('currentUser', "", {maxAge: Date.now()});
				res.redirect("/?logout=success");
			},
			fail: () => res.send(jsonResponse.fail('Failed to logout'))
		});
});

router.get('/profile/editProfile', function(req, res) {
    res.render('pages/userDashboard/editProfileView');
});

router.post('/profile/editProfile', (req, res) =>
{  
    var editData = 
    [
        req.body.editProfile_firstName, 
        req.body.editProfile_lastName,
        req.body.editProfile_DOB,
        req.body.editProfile_phoneNumber
    ];
    userModel.editUserProfile(editData);
});

router.get('/profile/editAddress', function(req, res) {
    res.render('pages/userDashboard/editAddressView');
});

router.post('/profile/editAddress', auth.authorizeUser, (req, res) =>
{                   
    auth.getSessionFromCookie(req,
    {
        found: (sessionPK) => 
        {
            var editData = 
            [
                req.body.editAddress_line1, 
				req.body.editAddress_line2, 
				req.body.editAddress_city,
				req.body.editAddress_state,
                req.body.editAddress_country,
                req.body.editAddress_postcode,
                sessionPK
            ];

            userModel.editUserAddress((editData, result) => 
            {
                success: () =>
                {
                    res.redirect('/profile');
                }

            });
        },
        notFound: () => {} 
    });

});

router.get('/profile/editPayment', function(req, res) {
    res.render('pages/userDashboard/editPaymentView');
});

router.post('/profile/editPayment', auth.authorizeUser, (req, res) =>
{                   
    auth.getSessionFromCookie(req,
    {
        found: (sessionPK) => 
        {
            var editData = 
            [
                req.body.editPayment_nickname, 
				req.body.editPayment_cardholderName, 
				req.body.editPayment_number,
				req.body.editPayment_Expiry,
				req.body.editPayment_CVV,
                sessionPK
            ];

            userModel.editUserAddress((editData, result) => 
            {
                success: () =>
                {
                    res.redirect('/profile');
                }

            });
        },
        notFound: () => {} 
    });

});

router.get('/profile/createAd', function(req, res) {
    res.render('pages/userDashboard/createAd');
});

router.put('/modify', (req, res) =>
{

});

router.get('/purchase/:listingID', (req, res) =>
{

});

router.post('/confirm_purchase/:listingID', (req, res) =>
{

});

router.get('/', (req, res) =>
{

});

module.exports = { router };