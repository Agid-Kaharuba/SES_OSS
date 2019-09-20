const database = require('../utils/database');

exports.GetRecentListings = async function (callback) 
{
	var db = await database.connectDatabase();
	var query = `
SELECT 
	LS_PK as listingID, 
	LS_Title as listingTitle,
	LS_Price as listingPrice
FROM Listing
WHERE LS_IsActive = 1 
ORDER BY LS_PostedDate DESC 
LIMIT 10;
;`;

	await db.query(query, callback);
}