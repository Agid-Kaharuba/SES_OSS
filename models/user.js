const database = require('../utils/database');
const auth = require('../utils/authUtil');
const bcrypt = require('bcrypt');
const dateUtil = require('../utils/dateUtil');

exports.convertToFullUserObject = function (rawUser)
{
	return {
		id: rawUser.US_PK,
		username: rawUser.US_Username || null,
		password: rawUser.US_Password || null,
		email: rawUser.US_Email || null,
		firstName: rawUser.US_FirstName || null,
		lastName: rawUser.US_LastName || null,
		phoneNumber: rawUser.US_PhoneNumber || null,
		birthDate: rawUser.US_BirthDate || null,
		joinDate: rawUser.US_JoinDate || null
	};
};

exports.convertToUserObject = function (rawUser)
{
	return {
		id: rawUser.US_PK,
		username: rawUser.US_Username || null,
		email: rawUser.US_Email || null,
		firstName: rawUser.US_FirstName || null,
		lastName: rawUser.US_LastName || null,
		phoneNumber: rawUser.US_PhoneNumber || null,
		birthDate: rawUser.US_BirthDate || null,
		joinDate: rawUser.US_JoinDate || null
	};
};

let convertToUserProfileObject = function (rawUser)
{
	return {
		username: rawUser.US_Username,
		email: rawUser.US_Email,
		firstName: rawUser.US_FirstName,
		lastName: rawUser.US_LastName,
		phoneNumber: rawUser.US_PhoneNumber,
		birthDate: rawUser.US_BirthDate
		
	};
};

let convertToUserAddressObject = function (rawUser)
{
	return {
		id: rawUser.AD_PK,
		addressLine1: rawUser.AD_Line1,
		addressLine2: rawUser.AD_Line2,
		addressCity: rawUser.AD_City,
		addressState: rawUser.AD_State,
		addressCountry: rawUser.AD_Country,
		addressPostcode: rawUser.AD_PostCode
		
	};
};

let convertToUserPaymentObject = function (rawUser)
{
	return {
		paymentNickname: rawUser.PM_Nickname,
		paymentName: rawUser.PM_Name,
		paymentCardNumber: rawUser.PM_CardNumber,
		paymentExp: rawUser.PM_Expiry,
		paymentCVC: rawUser.PM_CVC
		
	};
};

/**
 * Retrieves the user from the database by id.
 * @param {string} id - The id of the user, this is the primary key in the database.
 * @param {userObject} callback - found(user) and notFound() expected
 */
exports.getUserFromID = function (id, callback = { found: (user) => { }, notFound: () => { }})
{
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
	db.query(query, inputs, (err, results) => 
	{
		if (err) console.log("User.js | getUserFromID | ERROR: " + err.message);

		if (results.length > 0) 
		{
			callback.found(this.convertToUserObject(results[0]));
		} 
		else
		{
			callback.notFound();
		}
	});
};

/**
 * Retrieves the database user object from the database by username.
 * @param {string} username - The username of the user.
 * @param {userObject} callback - found() and notFound() expected
 */
exports.getRawUser = function(username, callback = { found: (rawUser) => {}, notFound: () => {} })
{
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
		(err, results) =>
		{
			if (err) console.trace("Could not get user! ERROR: " + err.message);
			if (results.length > 0)
			{
				callback.found(results[0]);
			} 
			else
			{
				callback.notFound();
			}
	});
}

/**
 * Retrieves the user from the database by username. Be careful as the user contains the hashed password as well!
 * @param {string} username - The username of the user.
 * @param {userObject} callback - found() and notFound() expected
 */
exports.getFullUser = function (username, callback = { found: (user) => {}, notFound: () => {}})
{
	exports.getRawUser(username, {
		found: (rawUser) => callback.found(this.convertToFullUserObject(rawUser)),
		notFound: callback.notFound
	})
};

/**
 * Retrieves the user from the database by username.
 * @param {string} username - The username of the user.
 * @param {userObject} callback - found() and notFound() expected
 */
exports.getUser = function (username, callback = { found: (user) => {}, notFound: () => {}})
{
	exports.getRawUser(username, {
		found: (rawUser) => callback.found(this.convertToUserObject(rawUser)),
		notFound: callback.notFound
	})
};

/**
 * Checks that a user exists according to the username provided
 * @param  {string} username - Username of user.
 * @param {userObject} callback - found() and notFound() expected
 */
exports.checkUserExists = function (username, callback = { found: (user) => { }, notFound: () => { }})
{
	var db = database.connectDatabase();
	var query = `
SELECT NULL 
FROM User 
WHERE US_Username = ?
LIMIT 1
;`;
	var sanitsedInputs = [username];
	db.query(query, sanitsedInputs,
		(err, results) =>
		{
			if (err) console.trace("Could not determine if user exist! ERROR: " + err.message);
			if (results.length > 0)
			{
				callback.found();
			} else
			{
				callback.notFound();
			}
		});
};

/**
 * Checks that a user exists according to the id provided
 * @param  {string} id - id of user.
 * @param {userObject} callback - found() and notFound() expected
 */
exports.checkUserExistsByID = function (id, callback = { found: () => { }, notFound: () => {} })
{
	var db = database.connectDatabase();
	var query = `
SELECT NULL 
FROM User 
WHERE US_PK = ?
LIMIT 1
;`;
	var inputs = [id];
	db.query(query, inputs,
		(err, results) => 
		{
			if (err) console.log("User.js | checkUserExistsByID | ERROR: " + err.message);

			if (results.length > 0) 
			{
				callback.found();
			}
			else
			{
				callback.notFound();
			}
		});
};

/**
 * Registers a user in the database
 * @param {userObject} user - User to be added to database.
 * @param {userObject} callback - success() and fail({string} reason) expected
 */
exports.registerUser = function (user, callback = { success: () => { }, fail: () => { }})
{
	bcrypt.hash(user.password, 10, (errHash, encryptedPassword) => 
	{
		console.log(user.password);
		if (errHash) 
		{
			callback.fail("Error creating user hash.");
			return;
		}

		var db = database.connectDatabase();
		var query = `
INSERT INTO User (US_Username, US_Password, US_Email, US_FirstName, US_LastName, US_PhoneNumber, US_BirthDate)
VALUES (?, ?, ?, ?, ?, ? ,?)
;`;
		var sanitsedInputs = [user.username, encryptedPassword, user.email, user.firstName, user.lastName, user.phoneNumber, user.birthDate];
		db.query(query, sanitsedInputs, (errDb) => 
		{
			if (errDb) 
			{
				console.log("User.js | registerUser | ERROR: " + errDb.message);
				callback.fail("Error when creating user.");

			}
		});
		var sanitsedInputs = [user.username, encryptedPassword, user.email, user.firstName, user.lastName, user.phoneNumber, user.birthDate];
		db.query(query, sanitsedInputs, (errDb) => 
		{
			if (errDb) 
			{
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
exports.loginUser = function (username, password, callback = { success: (user) => { }, fail: (reason) => { }})
{
	exports.getFullUser(username,
		{
			found:
				(user) => 
				{
					bcrypt.compare(password, user.password, (err, compareResult) => 
					{
						if (err) 
						{
							console.trace("Password hash error " + err);
							callback.fail("There was an error comparing the hash.")
						}

						if (compareResult) 
						{
							callback.success(user);
						}
						else 
						{
							callback.fail("Login fail - Username or Password does not match.");
						}
					});
				},
			notFound:
				() => callback.fail("Login fail - Username or Password does not match.")
		});
};
/**
 * Get a user from a cookie
 * @param {} req The request object.
 * @param {} callback callbacks found(user), notFound() and done(). Also has a regardless(user) callback in which the user may be null.
 */
exports.getUserFromCookie = function(req, callback = { found: (user) => {}, notFound: () => {}, done: () => {}, regardless: (user) => {} })
{
	auth.getSessionFromCookie(req, 
	{
		found: (rawSession) =>
		{
			exports.getUserFromID(rawSession.SS_US,
			{
				found: (user) => 
				{
					if (callback.hasOwnProperty('found')) callback.found(user);
					if (callback.hasOwnProperty('regardless')) callback.regardless(user);
					if (callback.hasOwnProperty('done')) callback.done();
				},
				notFound: () =>
				{
					callback.notFound();
					if (callback.hasOwnProperty('regardless')) callback.regardless(null);
					if (callback.hasOwnProperty('done')) callback.done();
				}
			});
		},
		notFound: () =>
		{
			callback.notFound();
			if (callback.hasOwnProperty('regardless')) callback.regardless(user);
			if (callback.hasOwnProperty('done')) callback.done();
		}
	})
}

/**
 * Gets the user and checks if the user is an admin from a cookie. <p> </p>
 * Specifically designed to help out with getting information for the top bar.
 * @param {} callback callback with callback(user, isAdmin). user may be null if it not found.
 */
exports.getUserInfo = function(req, callback = (user, isAdmin) => {})
{
	exports.getUserFromCookie(req,
	{
		found: (user) => 
		{
			auth.checkAdminPrivileges(user.id, (hasPrivileges) => 
				callback(user, hasPrivileges));
		},
		notFound: () => callback(null, false)
	})
}

exports.getUserProfileInfo = function(userid, callback = { found: () => {}, notFound: () => {} })
{
	getUserProfile(userid, 
	{
		found: (userProfile) =>
		{
			getUserAddress(userid, 
			{
				found: (userAddress) =>
				{
					getUserPayment(userid, 
					{
						found: (userPayment) =>
						{
							callback.found(userProfile, userAddress, userPayment);
						},
						notFound:() =>
						{

						}
					});
				},
				notFound: () =>
				{
					
				}
				});
		},
		notFound: () =>
		{
		}
	});
	
}

const getUserProfile = function(userid, callback = { found: () => {}, notFound: () => {} })
{
	var db = database.connectDatabase();
	var query = `
	SELECT 
		US_Username,
		US_Email,
		US_FirstName,
		US_LastName,
		US_PhoneNumber,
		US_BirthDate
	FROM User
	LEFT JOIN Address ON US_PK = AD_US
	LEFT JOIN PaymentMethod ON US_PK = PM_US
	WHERE US_PK = ?
	`;
	db.query(query, [userid], (err, profile) =>
	{
		if (err)
		{
			console.log('Failed to get user info ' + err);
		}
		else
		{
			var userProfile = convertToUserProfileObject(profile[0]);
			callback.found(userProfile);
		}
	});
}

const getUserAddress = function(userid, callback = { found: () => {}, notFound: () => {} })
{
	var db = database.connectDatabase();
	var query2 = `
	SELECT 
		AD_PK,
		AD_Line1,
		AD_Line2,
		AD_City,
		AD_State,
		AD_Country,
		AD_PostCode
	FROM User
	LEFT JOIN Address ON US_PK = AD_US
	WHERE US_PK = ?
	`;
	var userAddress =[];
	db.query(query2, [userid], (err, address) =>
	{
		if (err)
		{
			console.log('Failed to get user info ' + err);
		}
		else
		{
			var i;
			for (i = 0; i < address.length; i++)
			{
				userAddress.push(convertToUserAddressObject(address[i]));
				callback.found(userAddress);
			}
		}
	});
	
}

const getUserPayment = function(userid, callback = { found: () => {}, notFound: () => {} })
{
	var db = database.connectDatabase();
	var query3 = `
	SELECT 
		PM_Nickname,
		PM_Name,
		PM_CardNumber,
		PM_Expiry,
		PM_CVC
	FROM User
	LEFT JOIN PaymentMethod ON US_PK = PM_US
	WHERE US_PK = ?
	`;
	var userPayment = [];
	db.query(query3, [userid], (err, payment) =>
	{
		if (err)
		{
			console.log('Failed to get user info ' + err);
		}
		else
		{
			var i;
			for (i = 0; i < payment.length; i++)
			{
				userPayment.push(convertToUserPaymentObject(payment[i]));
				callback.found(userPayment);
			}
		}

	});
}





/**
 * Function for internal use!
 * Returns an SQL comparision based on user model. E.g if user has id then it will return US_PK = <ID HERE>.
 * May return null and console log an error if user does not have id or username.
 */
let getIdentifiableCheck = function (user)
{
	// This is needed so we can use the escape function.
	const db = database.connectDatabase();

	if (user.hasOwnProperty('id'))
	{
		return `US_PK = ` + db.escape(user.id);
	}
	else if (user.hasOwnProperty('username')) 
	{
		return `US_Username = ` + db.escape(user.username);
	}
	else 
	{
		console.trace("Expected a user model with either an id or a username")
		return null;
	}
}

/**
 * @param  {} user The new updated user model. The model must be supplied with a username or id to uniquely identify the user.
 * @param {string} newPassword The new password to be placed.
 * @param  {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success()
 */
exports.modifyPassword = function (user, newPassword, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	bcrypt.hash(newPassword, 10, (err, encryptedPassword) =>
	{
		if (err)
		{
			console.trace("Failed to hash new password: " + err);
			if (callback.hasOwnProperty('fail')) callback.fail();
			if (callback.hasOwnProperty('done')) callback.done();
			return;
		}

		let query = `
			UPDATE User SET
			US_Password = ?
		`
		let check = getIdentifiableCheck(user);

		if (check != null)
		{
			query += ` WHERE ` + check;
			const db = database.connectDatabase();
			db.query(query, [encryptedPassword], (err, results) => 
			{
				if (err)
				{
					console.trace("Failed to get update new password: " + err);
					if (callback.hasOwnProperty('fail')) callback.fail();
				}
				else
				{
					if (callback.hasOwnProperty('success')) callback.success();
				}
				if (callback.hasOwnProperty('done')) callback.done();
			})
		}
		else 
		{
			if (callback.hasOwnProperty('fail')) callback.fail();
			if (callback.hasOwnProperty('done')) callback.done();
		}
	})
}

/**
 * @param  {} id The userid or primary key of the user.
 * @param {string} newPassword The new password to be placed.
 * @param  {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success()
 */
exports.modifyPasswordByID = function (userid, newPassword, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	return exports.modifyPassword({id: userid}, newPassword, callback);
}

/**
 * @param  {} username The username of the user.
 * @param {string} newPassword The new password to be placed.
 * @param  {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success()
 */
exports.modifyPasswordByUsername = function (username, newPassword, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	return exports.modifyPassword({username: username}, newPassword, callback);
}

/**
 * Internal Use. Used for #modifyUser functions
 */
const modifyUserByCheck = function(check, user, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	const db = database.connectDatabase();
	let query = `
		UPDATE User SET 
		US_FirstName = COALESCE(?, US_FirstName),
		US_LastName = COALESCE(?, US_LastName),
		US_BirthDate = COALESCE(?, US_BirthDate),
		US_PhoneNumber = COALESCE(?, US_PhoneNumber)
	`
	if (check != null)
	{
		query += ` WHERE ` + check;
	}
	else 
	{
		if (callback.hasOwnProperty('fail')) callback.fail();
		if (callback.hasOwnProperty('done')) callback.done();
		return;
	}

	db.query(query, [user.firstName, user.lastName, user.DOB, user.phoneNumber], (err, results) => 
	{
		if (err)
		{
			console.trace("Failed to update User: " + err);
			if (callback.hasOwnProperty('fail')) callback.fail();
		}
		else
		{
			if (callback.hasOwnProperty('success')) callback.success();
		}
		if (callback.hasOwnProperty('done')) callback.done();
	})
}

exports.createUserAddress = function(userid, address,callback = { success: () => {}, fail: () => {} } )
{
	const db = database.connectDatabase();
	let query = `INSERT INTO Address (AD_US, AD_Line1, AD_Line2, AD_City, AD_State, AD_Country, AD_Postcode)
	VALUES (? ,? , ?, ?, ?, ?, ?)`;

	db.query(query,[userid, address.addressLine1, address.addressLine2, address.city, address.state, address.country, address.postcode], (err,results) =>
	{
		if (err)
		{
			callback.fail('Failed to insert new address');
		}
		else
		{
			callback.success();
		}
	});
}

const modifyUserAddressByCheck = function(check, address, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	const db = database.connectDatabase();
	let query = `
		UPDATE Address SET 
		AD_Line1 = COALESCE(?, AD_Line1),
		AD_Line2 = COALESCE(?, AD_Line2),
		AD_City = COALESCE(?, AD_City),
		AD_State = COALESCE(?, AD_State),
		AD_Country = COALESCE(?, AD_Country),
		AD_PostCode = COALESCE(?, AD_PostCode)
	`
	if (check != null)
	{
		query += ` WHERE ` + check;
	}
	else 
	{
		if (callback.hasOwnProperty('fail')) callback.fail();
		if (callback.hasOwnProperty('done')) callback.done();
		return;
	}

	db.query(query, [address.addressLine1, address.addressLine2, address.city, address.state, address.country, address.postcode], (err, results) => 
	{
		if (err)
		{
			console.trace("Failed to update Address: " + err);
			if (callback.hasOwnProperty('fail')) callback.fail();
		}
		else
		{
			if (callback.hasOwnProperty('success')) callback.success();
		}
		if (callback.hasOwnProperty('done')) callback.done();
	})
}

exports.createUserPayment = function(userid, payment, callback = { success: () => {}, fail: () => {} } )
{
	const db = database.connectDatabase();
	let query = `INSERT INTO PaymentMethod (PM_US, PM_Nickname, PM_Name, PM_CardNumber, PM_Expiry, PM_CVC)
	VALUES (? ,? ,? ,? , ?, ?)`;

	db.query(query,[userid, payment.nickName, payment.name, payment.number, dateUtil.convertToMySQLDatetime(payment.exp), payment.cvc], (err,results) =>
	{
		if (err)
		{
			console.trace("failed to create user payment method " + err);
			callback.fail('Failed to insert new payment');
		}
		else
		{
			callback.success();
		}
	});
}

const modifyUserPaymentByCheck = function(check, payment, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	const db = database.connectDatabase();
	let query = `
		UPDATE PaymentMethod SET 
		PM_Nickname = COALESCE(?, PM_Nickname),
		PM_Name = COALESCE(?, PM_Name),
		PM_CardNumber = COALESCE(?, PM_CardNumber),
		PM_Expiry = COALESCE(?, PM_Expiry),
		PM_CVC = COALESCE(?, PM_CVC)
	`
	if (check != null)
	{
		query += ` WHERE ` + check;
	}
	else 
	{
		if (callback.hasOwnProperty('fail')) callback.fail();
		if (callback.hasOwnProperty('done')) callback.done();
		return;
	}

	db.query(query, [payment.nickName, payment.name, payment.number, dateUtil.convertToMySQLDatetime(payment.exp), payment.cvc], (err, results) => 
	{
		if (err)
		{
			console.trace("Failed to update Payment: " + err);
			if (callback.hasOwnProperty('fail')) callback.fail();
		}
		else
		{
			if (callback.hasOwnProperty('success')) callback.success();
		}
		if (callback.hasOwnProperty('done')) callback.done();
	})
}

/**
 * @param  {} user The new updated user model. The model must be supplied with a username or id to uniquely identify the user.
 * @param  {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success()
 */
exports.modifyUser = function (user, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	return modifyUserByCheck(getIdentifiableCheck(user), user, callback);
}

/**
 * @param  {} username The username of the user.
 * @param  {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success()
 */
exports.modifyUserByUsername = function (username, user, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	const db = database.connectDatabase();
	return modifyUserByCheck(`US_Username = ` + db.escape(username), user, callback);
}

/**
 * @param  {} id The userid or primary key of the user.
 * @param  {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success()
 */
exports.modifyUserByID = function (userid, user, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	const db = database.connectDatabase();
	return modifyUserByCheck(`US_PK = ` + db.escape(userid), user, callback);
}

exports.fillUserModel = function(obj, keyfrom, keyTo) 
{
	this.getUserFromID(obj[keyfrom], 
	{
		found: (user) => obj[keyTo] = user,
		notFound: () => obj[keyTo] = {}
	})
}

exports.modifyUserAddress = function (address, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	const db = database.connectDatabase();
	return modifyUserAddressByCheck(`AD_PK = ` + db.escape(address.id), address, callback);
}

exports.modifyUserPaymentByID = function (userid, address, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	const db = database.connectDatabase();
	return modifyUserPaymentByCheck(`PM_US = ` + db.escape(userid), address, callback);
}
