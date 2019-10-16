const express = require('express');
const homePage = require('../models/homePage');
const userModel = require('../models/user');
const baseView = require('../views/base')
const router = express.Router();
const attachmentUtil = require('../utils/attachmentUtil');

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

		for (var i = 0; i < results.length; i++) 
		{
			results[i].listingImg = attachmentUtil.getImgPath(results[i].listingID);
		}
		
		console.log(results);

		baseView.renderWithAddons(req, res, 'pages/home', 
		{
			user,
			currentUser,
			results,
			isAdmin
		})
	}))
})

module.exports = {router};
