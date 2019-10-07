const express = require('express');
const homePage = require('../models/homePage');
const auth = require('../utils/authUtil');
const userModel = require('../models/user');
const baseView = require('../views/base')
const htmlResponse = require('../utils/HTMLResponse');
const router = express.Router();

router.get('/', (req, res) =>
{
	console.log("Receieved req for homePage listings");
	homePage.GetRecentListings((err, results) => userModel.getUserInfo(req, (user, isAdmin) =>
	{
		if (err)
		{
			console.trace("Failed to get homepage! " + err);
			return;
		}
		let currentUser = user == null ? null : user.username;

		baseView.renderWithAddons(req, res, 'pages/home', 
		{
			user,
			currentUser,
			results,
			isAdmin
		})
	}))
})

router.get('/response', (req, res) =>
{
	htmlResponse.renderResponse(req, res);
})

router.get('confirmPurchase', (req, res) =>
{
	res.render('confirmPurchase');
});

module.exports = {router};
