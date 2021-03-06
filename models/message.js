const database = require('../utils/database');
const adminModel = require('./admin');

/**
 * Creates a new message from the message model object.
 * @param {} message Message model object.
 * @param {} callback Optional callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success()
 */
exports.createMessage = function(message, callback = { success: () => {}, fail: (reason) => {}, done: () => {}})
{
    if (message == null) 
    {
        console.trace('Received null message!');
        if (callback.hasOwnProperty('fail')) callback.fail('Message cannot be null!');
        if (callback.hasOwnProperty('done')) callback.done();
    } 
    else if (!message.hasOwnProperty('userIDFrom'))
    {
        console.trace('Received a message without userIDFrom');
        if (callback.hasOwnProperty('fail')) callback.fail('Message does not have a sender!');
        if (callback.hasOwnProperty('done')) callback.done();
    } 
    else if (!message.hasOwnProperty('userIDTo'))
    {
        console.trace('Received a message without userIDTo');
        if (callback.hasOwnProperty('fail')) callback.fail('Message does not have a recipient');
        if (callback.hasOwnProperty('done')) callback.done();
    }
    else if (!message.hasOwnProperty('header'))
    {
        callback.trace('Received a message without header');
        if (callback.hasOwnProperty('fail')) callback.fail('Message does not have a header!');
        if (callback.hasOwnProperty('done')) callback.done();
    }
    else 
    {
        const db = database.connectDatabase();
        let query = `
        INSERT INTO Message (MS_US_From, MS_US_To, MS_Header, MS_Body)
        VALUES (?, ?, ?, ?)
        `
        let inputs = [message.userIDFrom, message.userIDTo, message.header, message.body]
        db.query(query, inputs, (err, results) =>
        {
            if (err)
            {
                console.trace('Failed to insert a new message into the database! ' + err);
                if (callback.hasOwnProperty('fail')) callback.fail('Failed to insert a new message into the database')
            }
            else
            {
                if (callback.hasOwnProperty('success')) callback.success();
            }
            if (callback.hasOwnProperty('done')) callback.done();
        })
    }
}

/**
 * Internal function!
 * @param {} callback - Optional callbacks with success(results) and fail(reason) 
 */
const getMessagesByCheck = function(check, callback = { success: (results) => {}, fail: (reason) => {} })
{
    const db = database.connectDatabase();
    let query = `
    SELECT
        MS_PK AS id,
        MS_US_To AS userIDTo,
        US_To.US_Username AS usernameTo,
        MS_US_From AS userIDFrom,
        US_From.US_Username AS usernameFrom,
        MS_Header AS header,
        MS_Body AS body,
        MS_Date AS date
    FROM Message
    INNER JOIN User US_From ON MS_US_From = US_From.US_PK
    INNER JOIN User US_To ON MS_US_To = US_To.US_PK
    `

    if (check != null)
    {
        query += ' WHERE ' + check;
    }
    db.query(query, (err, results) =>
    {
        if (err) 
        {
            console.trace("Failed to get message! " + err);
            callback.fail("Could not get message from database");
        }
        callback.success(results);
    })
}

exports.getMessageByID = function(id, callback = { success: (message) => {}, fail: (reason) => {} })
{
    const db = database.connectDatabase();
    getMessagesByCheck('MS_PK = ' + db.escape(id), 
    {
        success: (results) => 
        {
            if (results.length > 0)
                callback.success(results[0])
            else
                callback.fail('Could not find message with id ' + id);
        },
        fail: callback.fail
    })
}

/**
 * Get all messages that is sent for a particular user.
 * @param {} userID The user id of the user.
 * @param {} callback Callbacks with success(messages) if successful, fail(reason) if failed.
 */
exports.getMessagesForUserID = function(userID, callback = { success: (messages) => {}, fail: (reason) => {} })
{
    const db = database.connectDatabase();
    getMessagesByCheck('MS_US_To = ' + db.escape(userID), callback)
}

/**
 * Get all messages that is sent for a particular user.
 * @param {} user User model object.
 * @param {} callback Callbacks with success(messages) if successful, fail(reason) if failed.
 */
exports.getMessagesForUser = function(user, callback = { success: (messages) => {}, fail: (reason) => {} })
{
    this.getMessagesForUserID(user.id, callback);
}

/**
 * Get all messages that is by a particular user.
 * @param {} userID The user id of the user.
 * @param {} callback Callbacks with success(messages) if successful, fail(reason) if failed.
 */
exports.getMessagesByUserID = function(userID, callback = { success: (messages) => {}, fail: (reason) => {} })
{
    const db = database.connectDatabase();
    getMessagesByCheck('MS_US_From = ' + db.escape(userID), callback);
}

/**
 * Get all messages that is by a particular user.
 * @param {} user User model object.
 * @param {} callback Callbacks with success(messages) if successful, fail(reason) if failed.
 */
exports.getMessagesByUser = function(user, callback = { success: (messages) => {}, fail: (reason) => {} })
{
    this.getMessagesByUserID(user.id, callback);
}

/**
 * Creates a new message from the message model object that will be sent to an admin.
 * @param {} message Message model object.
 * @param {} callback Optional callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success()
 */
exports.createMessageToAdmin = function(message, callback = { success: () => {}, fail: (reason) => {}, done: () => {}})
{
    adminModel.getAdminWithLowestMessage(
    {
        success: (userid) => 
        {
            message.useridTo = userid;
            this.createMessage(message, callback);
        },
        fail: (reason) =>
        {
            if (callback.hasOwnProperty('fail')) callback.fail(reason);
            if (callback.hasOwnProperty('done')) callback.done();
        }
    })
}