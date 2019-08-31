var mysql = require('mysql');
var fs = require('fs');
var db;

exports.connectDatabase = function()
{
	if (!db)
	{
		db = mysql.createConnection(
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

exports.createSchema = function()
{
	var db = exports.connectDatabase();
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

/**
 * @param  {string} username - Username of user.
 * @param  {selectUserCallback} callback - A callback when query is completed - comes with paramaters (err, results, fields)
 */
exports.selectUser = function(username, callback) {
	var db = exports.connectDatabase();
	var query = "SELECT * FROM User WHERE US_Username = ?";
	db.query(query, [username], callback);
}