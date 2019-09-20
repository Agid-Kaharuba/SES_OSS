var mysql = require('mysql');
var fs = require('fs');
var db;

exports.connectDatabase = function()
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

exports.createSchema = function()
{
	runScriptsFile(__dirname + "/sql/createDatabaseSchema.sql");
}

exports.populateDatabase = function()
{	
	runScriptsFile(__dirname + "/sql/populateDatabase.sql");
}

function runScriptsFile(dir)
{
	var db = exports.connectDatabase();
	var schema = fs.readFileSync(dir);
	var scripts = schema.toString().split("\n\n");

	for(let i = 0; i < scripts.length; i++)
	{
		var script = scripts[i]
		if (script != "")
		{
			db.query(script, (err) =>
			{
				if (err)
				{
					console.log("Unable to run the following script: " + script);
					console.log(err.sqlMessage);	
					console.log("-------------------------------------------------------")			
				}
			});
		}
	}
};