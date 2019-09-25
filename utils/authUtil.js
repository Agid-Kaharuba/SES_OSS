const jsonResponse = require('./JSONResponse');
const database = require('../utils/database');
const admin = require('../models/admin');

// The key of the session store.
const SessionCookieProp = 'session'
// The amount of hours before a session becomes invalid.
const SessionHoursExpiry = 24;

let getNewExpiryDate = function() 
{
    return new Date(new Date().getTime() + (1000 * 60 * 60 * SessionHoursExpiry))
}

let convertToDateTime = function(date) 
{
    return date.toISOString().slice(0, 19).replace('T',' ');
}

exports.getSessionFromUser = function(user, callback = (err, results, fields) => {}) 
{
    const db = database.connectDatabase();
    let query = `SELECT * FROM Session WHERE SS_US = ? LIMIT 1`;
    db.query(query, [user.id], callback);
}

exports.getSessionFromCookie = function(obj, callback = {found: (session) => {}, notFound: () => {}})
{
    if (!obj.cookies.hasOwnProperty(SessionCookieProp))
    {
        callback.notFound();
        return;
    }
    let sessionID = obj.cookies[SessionCookieProp]; 
    let db = database.connectDatabase();
    
    let query = `SELECT * FROM Session Where SS_PK = ? LIMIT 1`;
    var inputs = [sessionID];
    db.query(query, inputs, (err, results) => 
    {
        if (err)
        {
            console.error('Failed to get session from database!')
            callback.notFound();
            return;
        }
        
        if (results.length == 0)
            callback.notFound();
        else
            callback.found(results[0]);
    })
}

exports.tryAuthorizeUser = function(req, callback = {success: (rawSession) => {}, fail: () => {}})
{
    exports.getSessionFromCookie(req, {
        found: (rawSession) => 
        {
            if (Date.now() < rawSession.SS_ExpiryDate)
            {
                callback.success(rawSession)
            }
            else 
            {
                callback.fail();
            }
        },
        notFound: () => {
            callback.fail();
        }
    });
}

exports.authorizeUser = function(req, res, next)
{
    exports.tryAuthorizeUser(req, 
    {
        success: next,
        fail: () => res.send(jsonResponse.fail('Invalid authentication credentials!'))
    })
}

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
    exports.tryAuthorizeUser(req,
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

let attachSessionOnCookie = function(res, payload)
{
    res.cookie(SessionCookieProp, payload, {httpOnly: true, expiresIn: SessionHoursExpiry + 'h'});
}

let attachSessionForUser = function(res, user, callback = {success: () => {}, fail: () => {}}) 
{
    exports.getSessionFromUser(user, (err, results) => 
    {
        if (err)
        {
            console.error("Could not get the session id after making a new session, failing to create new session for user!");
            callback.fail();
            return;
        }
        attachSessionOnCookie(res, results[0].SS_PK);
        callback.success();
    })
}

let attachNewSession = function(res, user, callback = {success: () => {}, fail: () => {}}) 
{
    const db = database.connectDatabase();
    let query = `INSERT INTO Session (SS_US, SS_ExpiryDate) values (?, ?)`;
    let inputs = [user.id, convertToDateTime(getNewExpiryDate())];

    db.query(query, inputs, (err, results) => {
        if (err)
        {
            console.error('Could not create a new session for user!');
            callback.fail();
            return;
        } 
        attachSessionForUser(res, user, callback);
    })
}

let attachUpdatedSession = function(res, user, callback = {success: () => {}, fail: () => {}}) 
{
    const db = database.connectDatabase();
    let query = `UPDATE Session SET SS_ExpiryDate = ? WHERE SS_US = ?`;
    let inputs = [getNewExpiryDate(), user.id];

    db.query(query, inputs, (err, results) => {
        if (err) {
            console.error('Could not update session for user!');
            callback.fail();
            return;
        }
        attachSessionForUser(res, user, callback);
    })
}

exports.attach = function(res, user, callback = {success: () => {}, fail: () => {}})
{
    const db = database.connectDatabase();

    let query = `SELECT NULL FROM Session WHERE SS_US = ? LIMIT 1`;
    let inputs = [user.id];

    db.query(query, inputs, (err, results) => {
        if (results.length == 0)
            attachNewSession(res, user, callback);
        else
            attachUpdatedSession(res, user, callback);
    });
}

exports.deleteSessionForUser = function(user, callback = {success: () => {}, fail: () => {}})
{
    const db = database.connectDatabase();

    let query = `DELETE FROM Session WHERE SS_US = ?`;
    db.query(query, [user.id], (err, results) => 
    {
        if (err)
            callback.fail();
        else
            callback.success();
    })
}

exports.deleteSession = function(sessionID, callback = {success: () => {}, fail: () => {}})
{
    const db = database.connectDatabase();

    let query = `DELETE FROM Session WHERE SS_PK = ?`;
    db.query(query, [sessionID], (err, results) => 
    {
        if (err)
            callback.fail();
        else
            callback.success();
    })
}

exports.invalidateSession = function(req, callback = {success: () => {}, fail: () => {}})
{
    exports.getSessionFromCookie(req, {
        found: (rawSession) => exports.deleteSession(rawSession.SS_PK, callback),
        notFound: () => callback.fail()
    })
}