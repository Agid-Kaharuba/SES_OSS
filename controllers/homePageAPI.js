const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
{
	console.log("Receieved req for homePage listings");
	res.render('pages/home')
});

console.log("Receieved req for homePage listings");
homePage.GetRecentListings(
	(err, results) =>
	{
		if (err) throw err;
		res.sendFile(view.viewHomePage(results));
	});

module.exports = { router };