const express = require('express');
const userModel = require('../models/user')
const userView = require('../views/userView')
const jsonResponse = require('../utils/JSONResponse');

const router = express.Router();

// Every method is prepended with "/user" see app.js

//router.post('/register', async (req, res) => 
router.get('/register', async (req, res) => //MAKE SURE I AM NOT LEFT IN PRODUCTION
{
	try
	{
		//var user = req.body;
		var user = { //MAKE SURE I AM NOT LEFT IN PRODUCTION
			username: 		'LieAngels',
			password: 		'TestPassword',
			email: 			null,
			firstName: 		null,
			lastName: 		null,
			phoneNumber: 	null,
			birthDate: 		null,
			joinDate: 		null,
		};

		var userExists = await userModel.checkUserExists(user.username);
		if (!userExists)
		{
			var response = await userModel.registerUser(user);
			if (response == false)
			{
				res.send(jsonResponse.fail("Could not register new user"));
				return;
			}
			res.send(jsonResponse.success());
		}
		else
		{
			res.send(jsonResponse.fail("Could not register an already existing user"));
			return;
		}
	}
	catch
	{
		res.send(jsonResponse.fail("An unexpected error occured."));
	}
});

router.post('/login', async (req, res) => 
{
	var loginSuccessful = await userModel.loginUser(req.body.username, req.body.password);

	if (loginSuccessful)
	{
		//We need to send the user the session ID here too.
		// auth.attach(res, req.body.username);
		res.send(jsonResponse.success());
	}
	else
	{
		res.send(jsonResponse.fail("Invalid username or password"));
	}
})

router.get('/view-account', (req, res) => 
{
     res.send(userView.viewAccount());
})

router.put('/modify', (req, res) => 
{

})

router.get('/purchase/:listingID', (req, res) => 
{

})

router.post('/confirm_purchase/:listingID', (req, res) => 
{

})

module.exports = { router };