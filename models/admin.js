const database = require('../utils/database');

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