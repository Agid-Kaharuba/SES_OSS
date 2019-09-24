const database = require('../utils/database');
const userModel = require('./user');
const auth = require('../utils/authUtil');
const listingModel = require('./listing');

exports.getAllAdmins = function(callback = {success: (results) => {}, fail: (reason) => {}})
{
    const db = database.connectDatabase();
    let query = `
    SELECT
        US_PK AS id,
        US_Username AS username,
        US_Email AS email,
        US_FirstName AS firstName,
        US_LastName AS lastName,
        US_PhoneNumber AS phoneNumber,
        US_BirthDate AS birthDate,
        US_JoinDate AS joinDate
    FROM Admin 
    LEFT JOIN User ON Admin.AD_US = User.US_PK
    `
    db.query(query, (err, results) => 
    {
        if (err)
        {
            console.error('admin.js | getAllAdmins | getting all admins error: ' + err);
            callback.fail('Failed to get all admins from database!');
        }
        else
        {
            callback.success(results);
        }
    })
}

exports.giveUserAdminPrivileges = function(userID, callback = {success: () => {}, fail: (reason) => {}})
{
    auth.checkAdminPrivileges(userID, (hasPrivileges) =>
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
    auth.checkAdminPrivileges(userID, (hasPrivileges) =>
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