const express = require('express');

const userModel = require('../models/user');
const jsonResponse = require('../utils/JSONResponse');
const htmlResponse = require('../utils/HTMLResponse');
const auth = require('../utils/authUtil');
const baseView = require('../views/base');
const router = express.Router();
const listingModel = require('../models/listing');

// Every method is prepended with "/user" see app.js

router.post('/register', (req, res) =>
{
	var user = req.body;
	userModel.checkUserExists(user.username,
		{
			found: 
                () => htmlResponse.fail(req, res, 'Could not register an already existing user', 'Registration Failure'),
			notFound: 
				() => userModel.registerUser(user,
				{
					success:
						() => res.redirect("/?register=success"),
					fail:
						(reason) => htmlResponse.fail(req, res, reason)
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
					fail: () => htmlResponse.fail(req, res, 'Failed to create a new session', 'Failed to login')
				}),
			fail:
				(reason) => htmlResponse.fail(req, res, reason, 'Failed to login')
		});
});

router.get('/profile', (req, res) => 
{
	console.log("getting profile")
	auth.getSessionFromCookie(req, 
	{
		found: (session) =>
		{
			userModel.GetUserProfile(session,
			{
				success: (result) => 
				{
					res.render('userProfileView', { profile: result });
				},
				fail: () => console.log("User not found")
			});
		},
		notFound: () => console.log("Session not found")
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
			fail: () => htmlResponse.fail(req, res, 'Failed to logout', 'Logout failure')
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
    auth.getSessionFromCooksie(req,
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

router.get('/userListings', (req, res) =>
{
    baseView.renderWithCallback(req, res, 'pages/user/userListings', (user, isAdmin, next) =>
    {
        listingModel.getListingsForUser(user, 
        {
            success: (results) => next({results}),
            fail: (reason) => htmlResponse.fail(req, res, reason, 'Failed to get user listings')
        })
    })
})

router.get('/public/profile/id=:id', (req, res) =>
{
    baseView.renderWithCallback(req, res, 'pages/user/publicProfile', (user, isAdmin, next) =>
    {
        userModel.getUserFromID(req.params.id, 
        {
            found: (user) =>
            {
                let targetUser = user;
                listingModel.getListingsForUserByID(req.params.id, 
                {
                    success: (results) => next({targetUser, results}),
                    fail: (reason) => htmlResponse.fail(req, res, reason, 'Failed to get user listings')
                })
            },
            notFound: () => htmlResponse.fail(req, res, reason, 'Failed to find user')
        })
    })
})

router.get('/contact', function(req, res) {
	baseView.renderWithAddons(req, res, 'pages/contact');
});

router.get('/inbox', function(req, res) {
	baseView.renderWithAddons(req, res, 'pages/adminDashboard/inbox');
});

router.get('/email', function(req, res) {
	baseView.renderWithAddons(req, res, 'pages/adminDashboard/email');
});

module.exports = { router };