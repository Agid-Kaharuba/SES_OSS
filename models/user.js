const mysql = require("mysql");
const path = require('path');
const db = require('../utils/database');

exports.cb0 = function (req, res) 
{
	res.sendFile(path.join(__dirname, '../public/homePage', 'homePage.html'));
};

exports.checkUserDoesntAlreadyExist = function (req, res, next) 
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
// 	res.sendFile(path.join(__dirname, '../public/homePage', 'homePage.html'));
};

exports.validateUserLogin = function(name, password, callback = {success: () => {}, fail: () => {}}) 
{
	// Do some validation here

	// Sucess
	callback.success();

	// Fail
	//callback.fail();
}