const database = require('../utils/database');
const bcrypt = require('bcrypt');

let convertToUserObject = function (DBUser) {
	return {
		id: DBUser.US_PK,
		username: DBUser.US_Username || null,
		password: DBUser.US_Password || null,
		email: DBUser.US_Email || null,
		firstName: DBUser.US_FirstName || null,
		lastName: DBUser.US_LastName || null,
		phoneNumber: DBUser.US_PhoneNumber || null,
		birthDate: DBUser.US_BirthDate || null,
		joinDate: DBUser.US_JoinDate || null
	};
};

/**
 * Retrieves the user from the database by id.
 * @param {string} id - The id of the user, this is the primary key in the database.
 * @param {userObject} callback - found(user) and notFound() expected
 */
exports.getUserFromID = function (id, callback = {
	found: (user) => {
	}, notFound: () => {
	}
}) {
	const db = database.connectDatabase();
	let query = `
SELECT
	US_PK,
	US_Username,
	US_Email,
	US_FirstName,
	US_LastName,
	US_PhoneNumber,
	US_BirthDate,
	US_JoinDate
FROM User 
WHERE US_PK = ?
LIMIT 1
;`;
	let inputs = [id];
	db.query(query, inputs,
		(err, results) => {
			if (err) console.log("User.js | getUserFromID | ERROR: " + err.message);
			if (results.length > 0) {
				callback.found(convertToUserObject(results[0]));
			} else {
				callback.notFound();
			}
		});
};

/**
 * Retrieves the user from the database by username.
 * Retrieves the user from the database by username.
 * @param {string} username - The username of the user.
 * @param {userObject} callback - found() and notFound() expected
 */
exports.getUser = function (username, callback = {
	found: (user) => {
	},
	notFound: () => {
	}
}) {
	var db = database.connectDatabase();
	var query = `
SELECT
	US_PK,
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
	db.query(query, sanitsedInputs,
		(err, results) => {
			if (err) console.log("User.js | getUser | ERROR: " + err.message);
			if (results.length > 0) {
				callback.found(convertToUserObject(results[0]));
			} else {
				callback.notFound();
			}
		});


};

/**
 * Checks that a user exists according to the username provided
 * @param  {string} username - Username of user.
 * @param {userObject} callback - found() and notFound() expected
 */
exports.checkUserExists = function (username, callback = {
	found: (user) => {
	},
	notFound: () => {
	}
}) {
	var db = database.connectDatabase();
	var query = `
SELECT NULL 
FROM User 
WHERE US_Username = ?
LIMIT 1
;`;
	var sanitsedInputs = [username];
	db.query(query, sanitsedInputs,
		(err, results) => {
			if (err) console.log("User.js | checkUserExists | ERROR: " + err.message);
			if (results.length > 0) {
				callback.found();
			} else {
				callback.notFound();
			}
		});
};

/**
 * Checks that a user exists according to the id provided
 * @param  {string} id - id of user.
 * @param {userObject} callback - found() and notFound() expected
 */
exports.checkUserExistsByID = function (id, callback = {
	found: () => {
	}, notFound: () => {
	}
}) {
	var db = database.connectDatabase();
	var query = `
SELECT NULL 
FROM User 
WHERE US_PK = ?
LIMIT 1
;`;
	var inputs = [id];
	db.query(query, inputs,
		(err, results) => {
			if (err) console.log("User.js | checkUserExistsByID | ERROR: " + err.message);
			if (results.length > 0) {
				callback.found();
			} else {
				callback.notFound();
			}
		});
};

/**
 * Registers a user in the database
 * @param {userObject} user - User to be added to database.
 * @param {userObject} callback - success() and fail({string} reason) expected
 */
exports.registerUser = function (user, callback = {
	success: () => {
	}, fail: () => {
	}
}) {
	bcrypt.hash(user.password, 10, (errHash, encryptedPassword) => {
		console.log(user.password);
		if (errHash) {
			callback.fail("Error creating user hash.");
			return;
		}

		var db = database.connectDatabase();
		var query = `
INSERT INTO User (US_Username, US_Password, US_Email, US_FirstName, US_LastName, US_PhoneNumber, US_BirthDate)
VALUES (?, ?, ?, ?, ?, ? ,?)
;`;
		var sanitsedInputs = [user.username, encryptedPassword, user.email, user.firstName, user.lastName, user.phoneNumber, user.birthDate];
		db.query(query, sanitsedInputs, (errDb) => {
			if (errDb) {
				console.log("User.js | registerUser | ERROR: " + errDb.message);
				callback.fail("Error when creating user.");

			}
		});
		var sanitsedInputs = [user.username, encryptedPassword, user.email, user.firstName, user.lastName, user.phoneNumber, user.birthDate];
		db.query(query, sanitsedInputs, (errDb) => {
			if (errDb) {
				console.log("User.js | registerUser | ERROR: " + err.message);
				callback.fail("Error when creating user.");
				return;
			}

			callback.success();
		});

	});
};

/**
 * Attempts to log a user in using the given credentials
 * @param {string} username - Username credential
 * @param {string} password - Password credential.
 * @param {userObject} callback - success() and fail({string} reason) expected
 */
exports.loginUser = function (username, password, callback = {
	success: (user) => {
	}, fail: (reason) => {
	}
}) {
	exports.getUser(username,
		{
			found:
				(user) => {
					bcrypt.compare(password, user.password, (err, compareResult) => {
						if (err) {
							callback.fail("There was an error comparing the hash.")
						}
						if (compareResult) {
							callback.success(user);
						} else {
							callback.fail("Login fail - Username or Password does not match.");
						}
					});
				},
			notFound:
				() => callback.fail("Login fail - Username or Password does not match.")
		});
};

exports.GetUserProfile = function (sessionPk, callback = {
	found: (user) => {
	}, notFound: () => {
	}
}) {
	var db = database.connectDatabase();
	var query = `
SELECT 
	US_Username as username,
	US_Password as password,
	US_Email as email,
	US_FirstName as firstName,
	US_LastName as firstName,
	US_PhoneNumber as phoneNumber,
	US_BirthDate as DOB,
FROM Session
	INNER JOIN User ON SS_US = US_PK 
WHERE SS_PK = ? 
;`;

	var inputs = [];
	db.query(query, sanitsedInputs,
		(err, results) => {
			if (err) console.log("User.js | getUser | ERROR: " + err.message);
			if (results.length > 0) {
				callback.found(results);
			} else {
				callback.notFound();
			}
		});
};