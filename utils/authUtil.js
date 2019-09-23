const jsonResponse = require('./JSONResponse');
const database = require('../utils/database');

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

exports.getSessionFromUser = function (user, callback = (err, results, fields) => {}) 
{
    const db = database.connectDatabase();
    let query = `SELECT * FROM Session WHERE SS_US = ? LIMIT 1`;
    db.query(query, [user.id], callback);
}

const getSessionFromCookie = function(obj, callback = {found: (session) => {}, notFound: () => {}})
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
            console.error('Failed to get sesison from database!')
            return;
        }
        
        if (results.length == 0)
            callback.notFound();
        else
            callback.found(results[0]);
    })
}

exports.authorizeUser = function(req, res, next)
{
    getSessionFromCookie(req, {
        found: (session) => 
        {
            if (Date.now() < session.SS_ExpiryDate)
            {
                next();
            }
            else 
            {
                res.send(jsonResponse.fail('Invalid authentication credentials!'));
            }
        },
        notFound: () => res.send(jsonResponse.fail('Invalid authentication credentials!'))
    });
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

const deleteSessionForUser = function(user, callback = {success: () => {}, fail: () => {}})
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

const deleteSession = function(sessionID, callback = {success: () => {}, fail: () => {}})
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
    getSessionFromCookie(req, {
        found: (session) => deleteSession(session.SS_PK, callback),
        notFound: () => callback.fail()
    })
}