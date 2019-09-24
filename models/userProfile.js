const database = require('../utils/database');


exports.GetUserProfile = function (listingPK, callback = (result) => { }) 
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
    FROM User 
    WHERE US_Username = ?
    LIMIT 1?
    ;`;

	db.query(query, [listingPK], 
		(err, results) =>
		{ 
			if (err) throw err;
			callback(results);
		});
}