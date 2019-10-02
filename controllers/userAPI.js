const express = require('express');

const userModel = require('../models/user');
const userView = require('../views/userView');
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

router.post('/user/profile/editProfile', auth.authorizeUser, (req, res) =>
{
	var editData = [req.body.editProfile_userName, 
					req.body.editProfile_firstName, 
					req.body.editProfile_lastName,
					req.body.editProfile_DOB,
					req.body.editProfile_phoneNumber,
					req.body.editProfile_email]
	userModel.editUserProfile((editData, result) => {
			res.send('editProfileView', { profile : result });
		});
});

router.post('/user/profile/editAddress', auth.authorizeUser, (req, res) =>
{
	var editData = [req.body.editAddress_line1, 
					req.body.editAddress_line2, 
					req.body.editProfile_lastName,
					req.body.editProfile_DOB,
					req.body.editProfile_phoneNumber,
					req.body.editProfile_email]
	userModel.editUserProfile((editData, result) => {
			res.send('editAddressView', { profile : result });
		});
});

router.post('/user/profile/editPayment', auth.authorizeUser, (req, res) =>
{
	var editData = [req.body.editAddress_line1, 
					req.body.editAddress_line2, 
					req.body.editProfile_lastName,
					req.body.editProfile_DOB,
					req.body.editProfile_phoneNumber,
					req.body.editProfile_email]
	userModel.editUserProfile((editData, result) => {
			res.send('editAddressView', { profile : result });
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