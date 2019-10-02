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
    var sessionPk = auth.getSessionFromCookie(req);
	userModel.GetUserProfile(sessionPk,
    {
        success: (result) => 
        {
			baseView.renderWithAddons('userProfileView', { profile: result });
        },
        fail: () => { jsonResponse.fail("get user profile failed"); }
    })
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
    res.render('editProfileView');
});

router.post('/profile/editProfileDone', auth.authorizeUser, (req, res) =>
{                   
    auth.getSessionFromCookie(req,
    {
        found: (sessionPK) => 
        {
            var editData = 
            [
                req.body.editProfile_firstName, 
                req.body.editProfile_lastName,
                req.body.editProfile_DOB,
                req.body.editProfile_phoneNumber,
                sessionPK
            ];

            userModel.editUserProfile((editData, result) => 
            {
                res.redirect('/user/profile')
            });
        },
        notFound: () => {} 
    });

});

router.get('/profile/editAddress', function(req, res) {
    res.render('editAddressView');
});

router.post('/profile/editAddressDone', auth.authorizeUser, (req, res) =>
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
                res.redirect('/user/profile')
            });
        },
        notFound: () => {} 
    });

});

router.get('/profile/editPayment', function(req, res) {
    res.render('editPaymentView');
});

router.post('/profile/editAddressDone', auth.authorizeUser, (req, res) =>
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
                res.redirect('/user/profile')
            });
        },
        notFound: () => {} 
    });

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