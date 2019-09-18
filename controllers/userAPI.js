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
           			//We need to send the user the session ID here too.
					auth.attach(res, req.body.username);
					res.send(jsonResponse.success());
        		},
			fail: 
				(reason) => res.send(jsonResponse.fail(reason)),
    	});
})

router.get('/view-account', (req, res) => 
{
     res.send(userView.viewAccount());
})

router.put('/modify', (req, res) => 
{
    auth.validateOrFail(req, res, (username) => {
        // Do something here if valid
    });
})

router.get('/purchase/:listingID', (req, res) => 
{

})

router.post('/confirm_purchase/:listingID', (req, res) => 
{

})

module.exports = { router };