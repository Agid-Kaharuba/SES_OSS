const express = require('express');

const userModel = require('../models/user')
const userView = require('../views/userView')
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
				() => userModel.registerUser(req.body,
					{
						success: 
							() => res.send(jsonResponse.success()),
						fail: 
							(reason) => res.send(jsonResponse.fail(reason))
					})
		});
});

router.post('/login', (req, res) => 
{
	userModel.loginUser(req.body.username, req.body.password,    
		{
			success: 
				() => 
        		{
					userModel.getUser(req.body.username, 
					{
						found: (user) => auth.attach(res, user,
						{
							success: () => res.send(jsonResponse.success()),
							fail: () => res.send(jsonResponse.fail('Failed to create a new session'))
						}),
						notFound: () => res.send(jsonResponse.fail('Invalid user!'))
					})
        		},
			fail: 
				(reason) => res.send(jsonResponse.fail(reason)),
    	});
})

router.get('/view-account', auth.authorizeUser, (req, res) => 
{
	 res.send(userView.viewAccount());
})

router.post('/logout', (req, res) => 
{
	auth.invalidateSession(req, {
		success: () => res.send('Logout Sucessful'),
		fail: () => res.send(jsonResponse.fail('Failed to logout'))
	})
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

router.get('/edit_Profile/:id', (req, res) => 
{
})

module.exports = { router };