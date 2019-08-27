var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require("mysql");
module.exports = router;

//trying to move this function to homePage.js, but couldnt figure out how.
var checkUserDoesntAlreadyExit = function (req, res, next) 
{
	var userName = "retrieveMeFromTheHTML"
	let sql = 'SELECT TOP 1 1 FROM US_Users WHERE US_Name = ' + userName; //I should be sql-injection proofed in the future.
	db.query(sql, (err, result) =>
	{
		if (err)
		{
			throw err;
		}
		console.log(userName + " found as an existing user in the database.");

		if (len(result) == 0)
		{
			next();
		}
		else
		{
			//how do we tell the browser that the user already exists.
		}
	});
	res.sendFile(path.join(__dirname, '../html', 'bookstrapnew.html'));
};

//trying to move this function to _helper.js but couldnt figure out how,
var passwordHash = function (password, userUniqueKey)
{
	return s.split('').reduce(function(hash, c) 
	{
		return (((hash << 5) - hash) + c.charCodeAt(0)) | 0;
	}, 0);
}

router.get('/register', [checkUserDoesntAlreadyExit]);