const path = require('path');
const db = require('../utils/database');
const bcrypt = require('bcrypt')

/**
 * @param  {string} username - Username of user.
 * @param  {selectUserCallback} callback - A callback when query is completed - comes with paramaters (err, results, fields)
 */
let selectUser = function(username, callback) {
	var dbConnection = db.connectDatabase();
	var query = "SELECT * FROM User WHERE US_Username = ?";
	dbConnection.query(query, [username], callback);
}

let insertUser = function(user, password, callback) {
	var dbConnection = db.connectDatabase();
	var query = "INSERT User " +
				"(US_Username, US_Password, US_Email, US_FirstName, US_LastName, US_PhoneNumber, US_BirthDate) " +
				"VALUES (?, ?, ?, ?, ?, ? ,?)";
	var values = [user.username, password, user.email, user.firstName, user.lastName, user.phoneNumber, user.birthDate];
	dbConnection.query(query, values, callback);
}

/**
 * Just a nicer and more consistent syntax converter.
 */
let convertToUser = function(DBUser) 
{
	return {
		username: DBUser.US_Username,
		password: DBUser.US_Password,
		email: DBUser.US_Email,
		firstName: DBUser.US_FirstName,
		lastName: DBUser.US_LastName,
		phoneNumber: DBUser.US_PhoneNumber,
		birthDate: DBUser.US_BirthDate,
		joinDate: DBUser.US_JoinDate
	}
}

exports.cb0 = function (req, res) 
{
	res.sendFile(path.join(__dirname, '../public/homePage', 'homePage.html'));
};

/**
 * Simply get the user from the database by username. 
 * If multiple user exist which should not happen, it will return the first one.
 * 
 * @param  {} username The username of the user.
 * @param  {} callback A callback which will be called when and if a user is found.
 */
exports.getUser = function(username, callback) 
{
	selectUser(username, (err, results) => 
	{
		if (results.length > 0)
		{
			callback(convertToUser(results[0]));
		}
	})
}

exports.checkUserExist = function(user, callback = {found: () => {}, notFound: () => {}}) 
{
	selectUser(user.username, (err, results) => 
	{
		if (!err && results.length > 0)
		{
			callback.found();
		}
		else
		{
			callback.notFound();
		}
	});
}

exports.registerUser = function(user, callback = {success: () => {}, fail: () => {}})
{
	bcrypt.hash(user.password, 10, (errHash, hash) => 
	{
		if (errHash) 
		{
			callback.fail();
			return;
		}
		
		insertUser(user, hash, (errDB) => 
		{
			if (errDB)
			{
				console.error("Error when registering user:", errDB);
				callback.fail();
			}
			else
			{
				callback.success();
			}
		});
	});
}

exports.validateUserLogin = function(user, callback = {success: () => {}, fail: () => {}}) 
{
	selectUser(user.username, (err, results, fields) => 
	{
		let found = false;

		results.forEach(result => bcrypt.compare(user.password, result.US_Password, (err, compareRes) =>
		{
			if (!found)
			{
				found = true;

				if (compareRes)
				{
					callback.success();
				}
				else
				{
					callback.fail();
				}
			} 
			else 
			{
				console.error("ERROR found multiple rows for the same username!!!");
			}
		}));
	});
}