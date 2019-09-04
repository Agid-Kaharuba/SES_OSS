const database = require('../utils/database');
const hash = require('../utils/hash');

let convertToUserObject = function(DBUser) 
{
	return 	{
				username: 		DBUser.US_Username 		|| null,
				password: 		DBUser.US_Password 		|| null,
				email: 			DBUser.US_Email 		|| null,
				firstName: 		DBUser.US_FirstName 	|| null,
				lastName: 		DBUser.US_LastName 		|| null,
				phoneNumber: 	DBUser.US_PhoneNumber 	|| null,
				birthDate: 		DBUser.US_BirthDate 	|| null,
				joinDate: 		DBUser.US_JoinDate 		|| null
			};
}

/**
 * Retrieves the user from the database by username. 
 * @param {string} username - The username of the user.
 * @returns {Promise<userObject>} - Returns the user if found, otherwise null.
 */
exports.getUser = async function(username) 
{
	var db = await database.connectDatabase();
	var query = `
SELECT
	US_Username,
	US_Password,
	US_Email,
	US_FirstName,
	US_LastName,
	US_PhoneNumber,
	US_BirthDate,
	US_JoinDate
FROM User 
WHERE US_Username = ?
LIMIT 1
;`;
	var sanitsedInputs = [username];
	var results = await db.query(query, sanitsedInputs, (err) => { if (err) console.log("User.js | getUser | ERROR: " + err.message); });

	if (results.length > 0)
	{
		return convertToUserObject(results[0]);
	}
	else
	{
		return null;
	}
}

/**
 * Checks that a user exists according to the username provided
 * @param  {string} username - Username of user.
 * @returns {Promise<boolean>} - whether user was found or not.
 */
exports.checkUserExists = async function(username) 
{
	var db = await database.connectDatabase();
	var query = `
SELECT NULL 
FROM User 
WHERE US_Username = ?
LIMIT 1
;`;
	var sanitsedInputs = [username];
	var results = await db.query(query, sanitsedInputs, (err) => { if (err) console.log("User.js | checkUserExists | ERROR: " + err.message); });
	return results.length > 0;
}

/**
 * Registers a user in the database
 * @param {userObject} user - User to be added to database.
 * @returns {Promise<boolean>} - whether user was added successfully.
 */
exports.registerUser = async function(user)
{
		var encryptedPassword = await hash.getHash(user.password);
		var db = await database.connectDatabase();
		var query = `
INSERT INTO User (US_Username, US_Password, US_Email, US_FirstName, US_LastName, US_PhoneNumber, US_BirthDate)
	VALUES (?, ?, ?, ?, ?, ? ,?)
;`;
		var sanitsedInputs = [user.username, encryptedPassword, user.email, user.firstName, user.lastName, user.phoneNumber, user.birthDate];
		await db.query(query, sanitsedInputs, (err) => 
		{ 
			if (err)
			{
				console.log("User.js | registerUser | ERROR: " + err.message) 
				return false;
			};
		});
		return true;
}

/**
 * Attempts to log a user in using the given credentials
 * @param {string} username - Username credential
 * @param {string} password - Password credential.
 * @returns {Promise<boolean>} - whether user was added successfully.
 */
exports.loginUser = async function(username, password) 
{
	var encryptedPassword = await hash.getHash(password);
	var db = await database.connectDatabase();
	var query = `
SELECT NULL 
FROM User 
WHERE US_Password = ? AND US_Username = ?
LIMIT 1
;`;
	var sanitsedInputs = [encryptedPassword, username];
	var results = await db.query(query, sanitsedInputs, (err) => 
	{ 
		if (err)
		{
			console.log("User.js | loginUser | ERROR: " + err.message) 
			return false;
		};
	});

	return results.length > 0;
}