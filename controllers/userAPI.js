const express = require('express');

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
                        success: () => res.redirect("/?login=success"),
                        fail: () => res.send(jsonResponse.fail('Failed to create a new session'))
                    }),
            fail:
                (reason) => res.send(jsonResponse.fail(reason)),
        });
});

router.get('/user/profile', (req, res) => 
{
	userModel.GetUserProfile(
		(result) => {
			res.render('userProfileView', { profile: result });
		});
});

router.post('/logout', (req, res) => {
    auth.invalidateSession(req, {
        success: () => res.send('Logout Sucessful'),
        fail: () => res.send(jsonResponse.fail('Failed to logout'))
    })
});

router.get('/user/profile/editProfile', function(req, res) {
    res.render('editProfileView');
});

router.post('/user/profile/editProfileDone', auth.authorizeUser, (req, res) =>
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

router.get('/user/profile/editAddress', function(req, res) {
    res.render('editAddressView');
});

router.post('/user/profile/editAddressDone', auth.authorizeUser, (req, res) =>
{
	var editData = [req.body.editAddress_line1, 
					req.body.editAddress_line2, 
					req.body.editProfile_lastName,
					req.body.editProfile_DOB,
					req.body.editProfile_phoneNumber]
	userModel.editUserProfile((editData, result) => {
			res.redirect('/user/profile')
		});
});

router.get('/user/profile/editPayment', function(req, res) {
    res.render('editPaymentView');
});


router.post('/user/profile/editPaymentDone', auth.authorizeUser, (req, res) =>
{
	var editData = [req.body.editPayment_nickname, 
					req.body.editPayment_cardholderName, 
					req.body.editPayment_number,
					req.body.editPayment_Expiry,
					req.body.editPayment_CVV]
	userModel.editUserProfile((editData, result) => {
            res.redirect('/user/profile')
		});
});

router.put('/modify', (req, res) => {

});

router.get('/purchase/:listingID', (req, res) => {

});

router.post('/confirm_purchase/:listingID', (req, res) => {

});

router.get('/', (req, res) =>
{

});

module.exports = { router };