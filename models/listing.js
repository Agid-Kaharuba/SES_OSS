const database = require('../utils/database');


exports.GetListing = function (listingPK, callback = { found: (result) => { }, notFound: () => { } })
{
	var db = database.connectDatabase();
	var query = `
SELECT
	US_Username as sellerUsername,
    LS_Title as listingTitle,
	LS_Description as listingDescription,
	LS_Price as listingPrice,
	LS_RemainingStock as remainingStock,
	AT_PK as imgName
FROM Listing
	INNER JOIN User ON LS_US_Seller = US_PK
	LEFT JOIN Attachment ON LS_PK = AT_ParentPK AND AT_ParentID = 'LS' AND AT_Type = 'IMG'
WHERE
	LS_IsActive = 1 AND
	LS_PK = ?
ORDER BY AT_Description ASC
LIMIT 1
;`;

	db.query(query, [listingPK], 
		(err, results) =>
		{ 
			if (err) throw err;
			if (results.length == 1)
			{
				callback.found(results);
			}
			else
			{
				callback.notFound();
			}
		});
}

exports.SearchListings = function (searchTerm, callback = (result) => { }) 
{
	var db = database.connectDatabase();
	var query = `
SELECT
	US_Username as sellerUsername,
	LS_Title as listingTitle,
	LS_Price as listingPrice,
	LS_PK as listingID,
	AT_PK as imgName
FROM Listing
	INNER JOIN User ON LS_US_Seller = US_PK
	LEFT JOIN Attachment ON LS_PK = AT_ParentPK AND AT_ParentID = 'LS' AND AT_Type = 'IMG'
WHERE
	LS_IsActive = 1 AND 
	INSTR(LS_Title, ?)
;`;

	db.query(query, [searchTerm], 
		(err, results) =>
		{ 
			if (err) throw err;
			callback(results);
		});
}

exports.GetPurchaseSummary = function(purchasePK, userPK, callback = { found: (result) => { }, notFound: () => { } })
{
	var db = database.connectDatabase();
	var query = `
	SELECT 
	Ad.LS_Title as listingTitle,
    Ad.LS_Description as listingDescription,
    Ad.LS_PK as listingID,
	Seller.US_Username as sellerUsername,
    Purchase.PC_PK as purchaseID,
    Purchase.PC_Price as purchasePrice,
    Purchase.PC_Date as purchaseDate,
    Purchase.PC_Quantity as purchaseQuantity,
    Delivery.AD_Line1 as deliveryLine1,
    Delivery.AD_Line2 as deliveryLine2,
    Delivery.AD_City as deliveryCity,
    Delivery.AD_State as deliveryState,
    Delivery.AD_PostCode as deliveryPostCode,
    Delivery.AD_Country as deliveryCountry,
    Payment.PM_Nickname as paymentNickname,
    Payment.PM_Name as paymentName,
    CASE WHEN Payment.PM_CardNumber IS NOT NULL AND LENGTH(Payment.PM_CardNumber) > 4 
			THEN LPAD(SUBSTR(Payment.PM_CardNumber,-4),LENGTH(Payment.PM_CardNumber),'*') 
            ELSE Payment.PM_CardNumber 
	END as paymentNumber
FROM Purchase
	LEFT JOIN User 			as Buyer ON PC_US_Buyer = Buyer.US_PK
    LEFT JOIN Listing 		as Ad ON PC_LS = Ad.LS_PK
    LEFT JOIN User 			as Seller ON Ad.LS_US_Seller = Seller.US_PK
    LEFT JOIN Address 		as Delivery ON PC_AD_Delivery = Delivery.AD_PK
    LEFT JOIN PaymentMethod as Payment ON PC_PM = Payment.PM_PK
WHERE 
	PC_PK = ?
	AND Buyer.US_PK = ?
LIMIT 1
;`;

	db.query(query, [purchasePK, userPK], (err, results) =>
	{
		if (err) throw err;

		if (results.length > 0)
		{
			callback.found(results[0]);
			return
		}
		else
		{
			callback.notFound();
			return;
		}
	});
}

/**
 * Create a new listing for a particular user identified by id.
 * @param {string} userid The id of the user.
 * @param {} listing The listing model.
 * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.createListingForUserID = function(userid, listing, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	const db = database.connectDatabase();
	let query = `
		INSERT INTO Listing (LS_US_Seller, LS_Title, LS_Description, LS_Price, LS_RemainingStock, LS_IsActive)
		VALUES (?, ?, ?, ?, ?, 1);
	`
	if (listing.remainingStock == null)
		var remainingStock = 1;
	else
		var remainingStock = listing.remainingStock;

	let inputs = [userid, listing.title, listing.description, listing.price, remainingStock, 1];
	db.query(query, inputs, (err, results) =>
	{
		if (err)
		{
			console.trace('Failed to create listing: ' + err);
			if (callback.hasOwnProperty('fail')) callback.fail();
		}
		else
		{
			if (callback.hasOwnProperty('success')) callback.success();
		}
		if (callback.hasOwnProperty('done')) callback.done();
	})
}

/**
 * Create a new listing from a full model.
 * @param {} listing The listing model.
 * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.createListing = function(listing, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	createListingForUserID(listing.user.id, listing, callback);
}

/**
 * Modify a listing defined by its id.
 * @param {} listingid The id or primary key of the listing.
 * @param {} listing The updated listing model.
 * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.modifyListingByID = function(listingid, listing, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	const db = database.connectDatabase();
	let query = `
		UPDATE Listing SET
		LS_US_Seller = COALESCE(?, LS_US_Seller),
		LS_Title = COALESCE(?, LS_Title),
		LS_Description = COALESCE(?, LS_Description),
		LS_Price = COALESCE(?, LS_Price),
		LS_IsActive = COALESCE(?, LS_isActive),
		LS_RemainingStock = COALESCE(?, LS_RemainingStock)
		WHERE LS_PK = ?;
	`
	// Try to get user id from user model inside listing model.
	if (!listing.hasOwnProperty('user')) 
		var userid = null;
	else
		var userid = user.userid;

	let inputs = [userid, listing.title, listing.description, listing.price, listing.isActive, listing.remainingStock, listingid]
	db.query(query, inputs, (err, results) => 
	{
		if (err)
		{
			console.trace('Failed to modify listing by id: ' + err);
			if (callback.hasOwnProperty('fail')) callback.fail();
		}
		else
		{
			if (callback.hasOwnProperty('success')) callback.success();
		}
		if (callback.hasOwnProperty('done')) callback.done();
	})
}

exports.purchaseItem = function(listingPK, buyerPK, paymentMethodPK, deliveryAddressPK, totalPrice, quantity, callback = { success: (purchasePK) => {}, fail: (reason) => {} })
{
	const db = database.connectDatabase();
	let query = `
	SELECT 
		LS_RemainingStock as remainingStock
		LS_IsActive as isActive
	FROM Listing
	WHERE LS_PK = ?
;`
	let sanitisedInputs = [listingPK];
	db.query(query, sanitisedInputs, (err, results) =>
	{
		if (err)
		{
			var reason = "Failed to check remaining stock of item";
			console.trace(reason + " - " + err);
			return callback.fail(reason);
		}
		
		if (results.length == 0)
		{
			return callback.fail("No listing found with the provided ID.");
		}
		else
		{
			if (!results[0].isActive)
			{
				return callback.fail("Tried to purchase an item which is no longer available.")
			}
			else if (results[0].remainingStock < quantity)
			{
				return callback.fail("Tried to purchase more stock than what is available.")
			}
			else
			{
				let query2 = `
INSERT INTO Purchase (PC_LS, PC_PM, PC_US_Buyer, PC_AD_Delivery, PC_Price, PC_Quantity)
	VALUES (?, ?, ?, ?, ?, ?);`;
				let sanitisedInputs2 = [listingPK, paymentMethodPK, buyerPK, deliveryAddressPK, totalPrice, quantity];
				db.query(query2, sanitisedInputs2, (err) => { if (err) console.trace(err) });

				let query3 = `
UPDATE Listing
	SET LS_RemainingStock = LS_RemainingStock - ?
WHERE LS_PK = ?
LIMIT 1
;`;
				let sanitisedInputs3 = [quantity, listingPK];
				db.query(query3, sanitisedInputs3, (err) => { if (err) console.trace(err) });

				let query4 = `
SELECT PC_PK as purchasePK
FROM Purchase
WHERE PC_US_Buyer = ?
ORDER BY PC_Date DESC
LIMIT 1
				;`;

				let sanitisedInputs4 = [buyerPK];
				db.query(query4, sanitisedInputs4, (err, results) => 
				{ 
					let errorMsg = "Error retrieving purchase summary.";
					if (err)
					{
						console.trace(err);
						return callback.fail(errorMsg);
					}
					
					if (results.length == 0 || results[0].purchasePK == null)
					{
						return callback.fail(errorMsg);
					}
					else
					{
						return callback.success(results[0].purchasePK);
					}
				});
			}
		}
	});
}

exports.getPrePurchaseInformation = function(userPK, listingPK, amount, callback = { success: () => { }, fail: () => { } })
{
	const db = database.connectDatabase();
	let paymentMethodsQuery = `
SELECT 
	PM_Nickname as paymentNickName,
	PM_Name as paymentName,
	CASE WHEN PM_CardNumber IS NOT NULL AND LENGTH(PM_CardNumber) > 4 
		THEN LPAD(SUBSTR(PM_CardNumber,-4),LENGTH(PM_CardNumber),'*') 
	ELSE PM_CardNumber 
END as paymentNumber
FROM PaymentMethod
WHERE PM_US = ?
;`;
	let sanitisedInputs = [userPK];
	db.query(paymentMethodsQuery, sanitisedInputs, (err, payments) =>
	{
		if (err)
		{
			console.trace(err);
			callback.fail("Failed to retrieve payment options");
		}

		let addressQuery = `
SELECT 
	AD_Line1 as addressLine1,
	AD_Line2 as addressLine2,
	AD_City as addressCity,
	AD_State as addressState,
	AD_PostCode as addressPostCode,
	AD_Country as addressCountry
FROM Address
WHERE AD_US = ?
;`;
		let sanitisedInputs2 = [userPK];
		db.query(addressQuery, sanitisedInputs2, (err, addresses) =>
		{
			if (err)
			{
				console.trace(err);
				callback.fail("Failed to retrieve address options");
			}
		});
	});
}

/**
 * Modify a listing.
 * @param {} listing The updated listing model.
 * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.modifyListing = function(listing, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	modifyListingByID(listing.id, listing, callback);
}

/**
 * Turns a listing into active state.
 * @param {string} listingID The listing id.
 * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.openListing = function(listingID, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	modifyListingByID(listingID, {isActive: true}, callback);
}

/**
 * Turns a listing into an inactive state.
 * @param {string} listingID The listing id.
 * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.closeListing = function(listingID, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	modifyListingByID(listingID, {isActive: false}, callback);
}