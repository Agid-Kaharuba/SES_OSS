const database = require('../utils/database');
/**
 * Creates a new message from the message model object.
 * @param {} message Message model object.
 * @param {} callback Optional callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success()
 */
exports.createMessage = function(message, callback = { success: () => {}, fail: (reason) => {}, done: () => {}})
{
    if (message == null) 
    {
        callback.trace('Received null message!');
        if (callback.hasOwnProperty('fail')) callback.fail('Message cannot be null!');
        if (callback.hasOwnProperty('done')) callback.done();
    } 
    else if (!message.hasOwnProperty('useridFrom'))
    {
        callback.trace('Received a message without useridFrom');
        if (callback.hasOwnProperty('fail')) callback.fail('Message does not have a sender!');
        if (callback.hasOwnProperty('done')) callback.done();
    } 
    else if (!message.hasOwnProperty('useridTo'))
    {
        callback.trace('Received a message without useridTo');
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
        INSERT INTO Message (MS_US_To, MS_US_From, MS_Header, MS_Body)
        VALUES (?, ?, ?, ?)
        `
        let inputs = [message.useridFrom, useridTo, header, body]
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
const getMessageByCheck = function(check, callback = { success: (results) => {}, fail: (reason) => {} })
{
    const db = database.connectDatabase();
    let query = `
    SELECT
        MS_PK AS id,
        MS_US_To AS useridTo,
        MS_US_From AS useridFrom,
        MS_Header AS header,
        MS_Body AS body,
        MS_Date AS date
    FROM Message
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

exports.getMessageByID(id, callback = { success: (message) => {}, fail: (reason) => {} })
{
    const db = database.connectDatabase();
    getMessageByCheck('MS_PK = ' + db.escape(id), 
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

exports.getMessagesForUserID(userid, callback = { success: (messages) => {}, fail: (reason) => {} })
{
    const db = database.connectDatabase();
    getMessageByCheck('MS_US_FROM = ' + db.escape(id), callback)
}

exports.getMessageForUser(user, callback = { success: (message) => {}, fail: (reason) => {} })
{
    this.getMessageByUserID(user.id, callback);
}z