const database = require('../utils/database');
const user = require('./user');
const auth = require('../utils/authUtil');

exports.checkAdminPrivileges = function(user, callback = (hasPrivileges) => {}) 
{
    const db = database.connectDatabase();
    let query = 
    `SELECT * from User INNER JOIN Admin ON Admin.AD_US = User.US_PK 
    WHERE User.US_PK = ? LIMIT 1`;

    db.query(query, user.id, (err, results) => 
    {
        if (results.length > 0)
            callback(true);
        else
            callback(false);
    })
}

exports.tryAdminAction = function(user, callback = {success: () => {}, fail: () => {}})
{
    checkAdminPrivileges(user, (hasPrivileges) =>
    {
        if (hasPrivileges)
            success();
        else
            fail();
    })
}

exports.authorizeAdmin = function(req, res, next) 
{
    auth.tryAuthorizeUser(req,
    {
        success: (rawSession) => 
        {
            user.getUserFromID(rawSession.SS_US,
            {
                found: (user) =>
                {
                    tryAdminAction(user,
                    {
                        success: next,
                        fail: () => res.send(jsonResponse.fail('Access is not allowed for the user'))
                    })
                },
                notFound: () => res.send(jsonResponse.fail('Invalid authentication credentials!'))
            })
        },
        fail: res.send(jsonResponse.fail('Invalid authentication credentials!'))
    })
}