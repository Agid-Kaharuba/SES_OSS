var mysql = require("mysql");
var path = require('path');
var db = require('../database.js');

var cb0 = function (req, res) 
{
	res.sendFile(path.join(__dirname, '../html', 'bookstrapnew.html'));
};

var checkUserDoesntAlreadyExist = function (req, res, next) 
{
	var userName = "Test"
	let sql = "SELECT * FROM User WHERE US_Username = '" + userName + "'"; //I should be sql-injection proofed in the future.
	db.query(sql, (err, result) =>
	{
		if (err)
		{
			throw err;
		}
		console.log(userName + " - looking for existing user in the database.");

		if (result != "")
		{
			console.log("Found!");
		}
		else
		{
			console.log("Not found :(");
		}
	});
// 	res.sendFile(path.join(__dirname, '../html', 'bookstrapnew.html'));
};

module.exports = { checkUserDoesntAlreadyExist, cb0 };