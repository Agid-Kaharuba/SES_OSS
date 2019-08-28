var mysql = require('mysql');
var dotenv = require('dotenv');
dotenv.config();

var db;

function connectDatabase()
{
	if (!db)
	{
		var db = mysql.createConnection(
		{
			host        : process.env.MYSQL_HOST,
			user        : process.env.MYSQL_USER,
			password    : process.env.MYSQL_PASS,
			database	: process.env.MYSQL_DB
		})

	}

	db.connect((err) =>
	{
		if (err)
		{
			console.log("MySql Failed to Connect - comment out the 'throw err;' if it's messing you up");
			throw err;
		}
		console.log("MySql Connected...")
	});

	return db;
}

module.exports = connectDatabase();