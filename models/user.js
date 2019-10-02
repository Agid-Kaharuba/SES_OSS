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
 * Retrieves the user from the database by username.
 * @param {string} username - The username of the user.
 * @param {userObject} callback - found() and notFound() expected
 */
exports.getUser = function (username, callback = {
    found: (user) => {},
    notFound: () => {}
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
        (err, results) =>
        {
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
    found: (user) => {},
    notFound: () => {}
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
exports.loginUser = function (username, password, callback = {success: (user) => {}, fail: (reason) => {}}) {
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


exports.GetUserProfile = function (sessionPk, callback = (result) => { }) {
	var db = database.connectDatabase();
    var query = `
    SELECT
        US_PK AS id,
        US_Username AS username,
        US_Email AS email,
        US_FirstName AS firstName,
        US_LastName AS lastName,
        US_PhoneNumber AS phoneNumber,
        US_BirthDate AS birthDate,
        US_JoinDate AS joinDate
    FROM Session 
    LEFT JOIN User ON Session.SS_US = User.US_Username
    LIMIT 1
    `
    db.query(query, (err, results) => 
    {
        if (err)
        {
            console.error('user.js | getUserProfile | getting user profile error: ' + err);
            callback.fail('Failed to get profile from database');
        }
        else
        {
            callback.success(results);
        }
    })
};

exports.editUserProfile = function (editData, callback = (result) => { }) {
	var db = database.connectDatabase();
    var query = `
    UPDATE User
	    SET US_FirstName = ?,
	    SET US_LastName = ?,
	    SET US_BirthDate = ?,
	    SET US_PhoneNumber = ?,
    FROM User 
        LEFT JOIN Session ON SS_PK = ? AND SS_US = US_PK
    LIMIT 1
	;`;
	
    db.query(query, editData, (err, results) => 
    {
        if (err)
        {
            console.error('user.js | editUserProfile | editing user profile error: ' + err);
            callback.fail('Failed to edit profile from database');
        }
        else
        {
            callback.success(results);
        }
    })
};

exports.editUserAddress = function (editData, callback = (result) => { }) {
	var db = database.connectDatabase();
    var query = `
    UPDATE Address
        SET AD_Line1 = ?,
        SET AD_Line2 = ?,
        SET AD_City = ?,
        SET AD_State = ?,
        SET AD_Country = ?,
        SET AD_PostCode = ?,
    FROM User 
        LEFT JOIN Session ON SS_PK = ? AND SS_US = US_PK
    WHERE AD_US = SS_US
    LIMIT 1
	`
	
    db.query(query, editData, (err, results) => 
    {
        if (err)
        {
            console.error('user.js | editUserAddress | editing user address error: ' + err);
            callback.fail('Failed to edit address from database');
        }
        else
        {
            callback.success(results);
        }
    })
};

exports.editUserPayment = function (editData, callback = (result) => { }) {
	var db = database.connectDatabase();
    var query = `
    UPDATE Payment
        SET PM_Nickname = ?,
        SET PM_Name = ?,
        SET PM_CardNumber = ?,
        SET PM_Expiry = ?,
        SET PM_CVC = ?,
    FROM User 
    LEFT JOIN Session ON SS_PK = ? AND SS_US = US_PK
    LIMIT 1
	`
	
    db.query(query, editData, (err, results) => 
    {
        if (err)
        {
            console.error('user.js | editUserPayment | editing user payment error: ' + err);
            callback.fail('Failed to edit address from database');
        }
        else
        {
            callback.success(results);
        }
    })
};