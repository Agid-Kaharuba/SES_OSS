var mysql = require('mysql');
var fs = require('fs');
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

		db.connect((err) =>
		{
			if (err)
			{
				console.log("MySql Failed to Connect - comment out the 'throw err;' if it's messing you up");
				throw err;
			}
			console.log("MySql Connected...")
		});
	}
	
	return db;
}

function createSchema()
{
	var db = connectDatabase();
	var schema = fs.readFileSync(__dirname + "/createDatabaseSchema.sql");
	var scripts = schema.toString().split("\n\n");
	var errors = 0
	scripts.forEach(function (script, index)
	{
		if (script != "")
		{
			db.query(script, (err) =>
			{
				if (err)
				{
					console.log("Unable to run the following script: " + script);
					console.log(err.sqlMessage);
					errors ++;
				}
			});
		}
	});

	return errors;
}

module.exports = { createSchema, connectDatabase };