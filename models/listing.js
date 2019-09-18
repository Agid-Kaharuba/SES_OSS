const database = require('../utils/database');

exports.GetListing = async function (id, callback) 
{
	var db = await database.connectDatabase();
	var query = `
SELECT
	US_Username as sellerUsername,
    LS_Title as listingTitle,
    LS_Description as listingDescription,
    LS_RemainingStock as remainingStock
FROM Listing
	INNER JOIN User ON LS_US_Seller = US_PK
WHERE
	LS_IsActive = 1 AND 
    LS_PK = ?
;`;

	var listing = await db.query(query, [id], callback);
	return listing;
}

exports.SearchListings = async function (searchTerm) 
{
	var db = await database.connectDatabase();
	var query = `
SELECT
	US_Username as sellerUsername,
    LS_Title as listingTitle
FROM Listing
	INNER JOIN User ON LS_US_Seller = US_PK
WHERE
	LS_IsActive = 1 AND 
    INSTR(LS_Title, ?)
;`;

	var listings = await db.query(query, [searchTerm]);
	return listings;
}
