const database = require('../utils/database');
const userModel = require('./user');
const auth = require('../utils/authUtil');
const jsonResponse = require('../utils/JSONResponse');
const listingModel = require('./listing');

exports.checkAdminPrivileges = function(userID, callback = (hasPrivileges) => {}) 
{
    const db = database.connectDatabase();
    let query = 
    `SELECT * from User INNER JOIN Admin ON Admin.AD_US = User.US_PK 
    WHERE User.US_PK = ? LIMIT 1`;

    db.query(query, userID, (err, results) => 
    {
        if (results.length > 0)
            callback(true);
        else
            callback(false);
    })
}

exports.tryAdminAction = function(userID, callback = {success: () => {}, fail: () => {}})
{
    exports.checkAdminPrivileges(userID, (hasPrivileges) =>
    {
        if (hasPrivileges)
            callback.success();
        else
            callback.fail();
    })
}

exports.authorizeAdmin = function(req, res, next) 
{
    auth.tryAuthorizeUser(req,
    {
        success: (rawSession) => 
        {
            exports.tryAdminAction(rawSession.SS_US,
            {
                success: next,
                fail: () => res.send(jsonResponse.fail('Access is not allowed for the user'))
            })
        },
        fail: () => res.send(jsonResponse.fail('Invalid authentication credentials!'))
    })
}

exports.giveUserAdminPrivileges = function(userID, callback = {success: () => {}, fail: (reason) => {}})
{
    exports.checkAdminPrivileges(userID, (hasPrivileges) =>
    {
        if (hasPrivileges) 
        {
            callback.fail('User already has admin privileges!')
            return;
        }
        const db = database.connectDatabase();
        let query = `INSERT INTO Admin (AD_US) VALUES (?)`
        db.query(query, [userID], (err, results) => 
        {
            if (err)
                callback.fail('Failed to give user admin from database!')
            else
                callback.success();
        })
    })
}

exports.revokeUserAdminPrivileges = function(userID, callback = {success: () => {}, fail: (reason) => {}})
{
    exports.checkAdminPrivileges(userID, (hasPrivileges) =>
    {
        if (!hasPrivileges) 
        {
            callback.fail('User already does not have admin privileges!')
            return;
        }
        const db = database.connectDatabase();
        let query = `DELETE FROM Admin WHERE AD_US = ?`
        db.query(query, [userID], (err, results) => 
        {
            if (err)
                callback.fail('Failed to revoke user admin from database!')
            else
                callback.success();
        })
    })
}

const deleteUserInternal = function(id, callback = {success: () => {}, fail: (reason) => {}})
{
    const db = database.connectDatabase();
    let query = `DELETE FROM User WHERE US_PK = ?`
    db.query(query, [id], (err, results) => 
    {
        if (err)
        {
            console.error('admin.js | deleteUserInternal| Got admin user delete error: ' + err);
            callback.fail('Failed to admin delete user from database!');
        } 
        else
        {
            callback.success();
        }
    })
}

exports.deleteListing = function(id, callback = {success: () => {}, fail: (reason) => {}})
{
    listingModel.GetListing(id, (results) => {
        if (results.length == 0)
        {
            callback.fail('Could not delete a listing that does not exist!');
            return;
        }
        const db = database.connectDatabase();
        let query = `DELETE FROM Listing WHERE LS_PK = ?`
        
        db.query(query, [id], (err, results) =>
        {
            if (err)
            {
                console.error('admin.js | deleteUserInternal| Got admin listing delete error: ' + err);
                callback.fail('Failed to delete listing from database!');
            }
            else 
            {
                callback.success();
            }
        })
    })
}

exports.deleteUser = function(id, callback = {success: () => {}, fail: (reason) => {}})
{
    userModel.checkUserExistsByID(id, 
    {
        found: () =>
        {
            // Try to remove admin privileges if user is an admin
            exports.revokeUserAdminPrivileges(id, 
            {
                success: () => deleteUserInternal(id, callback),
                fail: () => deleteUserInternal(id, callback)
            })
        },
        notFound: () => callback.fail('Failed to admin delete a user that does not exist!')
    })
}