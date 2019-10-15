const database = require('../utils/database');
const userModel = require('./user');

exports.convertToListingObject = function(rawListing) {
    return {
        id: rawListing.LS_PK,
        sellerID: rawListing.LS_US_Seller,
        title: rawListing.LS_Title,
        description: rawListing.LS_Description,
        price: rawListing.LS_Price,
        remainingStock: rawListing.LS_RemainingStock,
        imgName: rawListing.AT_PK,
        isActive: rawListing.LS_IsActive.readInt8() == 1,
        postedDate: rawListing.LS_PostedDate,
    }
}

exports.GetListing = function(listingPK, callback = { found: (result) => {}, notFound: () => {} }) {
    var db = database.connectDatabase();
    var query = `
SELECT
	LS_PK as listingID,
	LS_US_Seller as sellerID,
	LS_PostedDate as postedDate,
	US_Username as sellerUsername,
    LS_Title as listingTitle,
	LS_Description as listingDescription,
	LS_Price as listingPrice,
	LS_RemainingStock as remainingStock,
    LS_IsActive as isActive
FROM Listing
	INNER JOIN User ON LS_US_Seller = US_PK
WHERE
	LS_PK = ?
LIMIT 1
;`;

    db.query(query, [listingPK],
        (err, results) => {
            if (err) throw err;
            if (results.length == 1) {
                results[0].isActive = results[0].isActive.readInt8() == 1;
                callback.found(results);
            } else {
                callback.notFound();
            }
        });

}

exports.SearchListings = function(searchTerm, callback = (result) => {}) {
    var db = database.connectDatabase();
    var query = `
SELECT
	US_PK as sellerID,
	US_Username as sellerUsername,
	LS_Title as listingTitle,
	LS_Price as listingPrice,
	LS_IsActive as isActive,
	LS_PK as listingID
FROM Listing
	INNER JOIN User ON LS_US_Seller = US_PK
WHERE
	LS_IsActive = 1 AND 
	(
		INSTR(LS_Title, ?)
		OR LS_PK = ?
	)
;`;

    db.query(query, [searchTerm, searchTerm],
        (err, results) => {
            if (err) throw err;
            results[0].isActive = results[0].isActive.readInt8() == 1;

            callback(results);
        });
}

exports.GetPurchaseSummary = function(purchasePK, userPK, callback = { found: (result) => {}, notFound: () => {} }) {
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

    db.query(query, [purchasePK, userPK], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            callback.found(results[0]);
            return
        } else {
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
exports.createListingForUserID = function(userid, listing, callback = { success: () => {}, fail: () => {}, done: () => {} }) {
        const db = database.connectDatabase();
        let insertListingQuery = `INSERT INTO Listing (LS_US_Seller, LS_Title, LS_Description, LS_Price, LS_RemainingStock) VALUES (?, ?, ?, ?, ?);`;
        let inputs = [userid, listing.title, listing.description, listing.price, listing.remainingStock];
        db.query(insertListingQuery, inputs, (err) => {
            if (err) throw err;

            callback.success();
        });

        callback.fail();
    }
    /**
     * Create a new listing from a full model.
     * @param {} listing The listing model.
     * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
     */
exports.createListing = function(listing, callback = { success: () => {}, fail: () => {}, done: () => {} }) {
    this.createListingForUserID(listing.user.id, listing, callback);
}

/**
 * Modify a listing defined by its id.
 * @param {} listingid The id or primary key of the listing.
 * @param {} listing The updated listing model.
 * @param {} callback callbacks with success() if successful, fail(reason) if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.modifyListingByID = function(listingid, listing, callback = { success: () => {}, fail: (reason) => {}, done: () => {} }) {
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

    if (listing.isActive == 'true')
        var isActive = 1;
    else if (listing.isActive == 'false')
        var isActive = 0;

    let inputs = [userid, listing.title, listing.description, listing.price, isActive, listing.remainingStock, listingid]
    db.query(query, inputs, (err, results) => {
        if (err) {
            console.trace('Failed to modify listing in the database! ' + err);
            if (callback.hasOwnProperty('fail')) callback.fail('Failed to modify listing in the database');
        } else {
            if (callback.hasOwnProperty('success')) callback.success();
        }
        if (callback.hasOwnProperty('done')) callback.done();
    })
}

exports.purchaseItem = function(purchase, callback = { success: (purchasePK) => {}, fail: (reason) => {} }) {
    const db = database.connectDatabase();
    let query = `
	SELECT 
		LS_RemainingStock as remainingStock,
		LS_IsActive as isActive
	FROM Listing
	WHERE LS_PK = ?
;`
    let sanitisedInputs = [purchase.listingID];
    db.query(query, sanitisedInputs, (err, results) => {
        if (err) {
            var reason = "Failed to check remaining stock of item";
            console.trace(reason + " - " + err);
            return callback.fail(reason);
        }

        if (results.length == 0) {
            return callback.fail("No listing found with the provided ID.");
        } else {
            if (!results[0].isActive) {
                return callback.fail("Tried to purchase an item which is no longer available.")
            } else if (results[0].remainingStock < purchase.quantity) {
                return callback.fail("Tried to purchase more stock than what is available.")
            } else {
                let query2 = `
INSERT INTO Purchase (PC_LS, PC_PM, PC_US_Buyer, PC_AD_Delivery, PC_Price, PC_Quantity)
	VALUES (?, ?, ?, ?, ?, ?);`;
                let sanitisedInputs2 = [purchase.listingID, purchase.paymentMethodID, purchase.buyerID, purchase.deliveryAddressID, purchase.totalPrice, purchase.quantity];
                db.query(query2, sanitisedInputs2, (err) => { if (err) console.trace(err) });

                let query3 = `
UPDATE Listing
	SET LS_RemainingStock = LS_RemainingStock - ?
WHERE LS_PK = ?
LIMIT 1
;`;
                let sanitisedInputs3 = [purchase.quantity, purchase.listingID];
                db.query(query3, sanitisedInputs3, (err) => { if (err) console.trace(err) });

                let query4 = `
SELECT PC_PK as purchasePK
FROM Purchase
WHERE PC_US_Buyer = ?
ORDER BY PC_Date DESC
LIMIT 1
				;`;

                let sanitisedInputs4 = [purchase.buyerID];
                db.query(query4, sanitisedInputs4, (err, results) => {
                    let errorMsg = "Error retrieving purchase summary.";
                    if (err) {
                        console.trace(err);
                        return callback.fail(errorMsg);
                    }

                    if (results.length == 0 || results[0].purchasePK == null) {
                        return callback.fail(errorMsg);
                    } else {
                        let purchasePK = results[0].purchasePK
                        notifySellerOfPurchase(purchasePK);
                        return callback.success(purchasePK);
                    }
                });
            }
        }
    });
}

function notifySellerOfPurchase(purchasePK)
{
	const db = database.connectDatabase();
	let insertMessageQuery = `
INSERT INTO Message (MS_US_To, MS_US_From, MS_Header, MS_Body) 
SELECT Seller.US_PK, Sys.US_PK, 
	(CONCAT(Buyer.US_Username, ' has purchased ', PC_Quantity, 'x ', LS_Title)),
	(CONCAT('Hello ', Seller.US_Username, ',\n',
		'This is an automated notification to let you know that ', Buyer.US_Username, ' has purchased ', PC_Quantity, 'x ', LS_Title, '\'s for a grand total of $', PC_Price, '.\n',
		'\n',
		'The buyer has requested the item(s) to be delivered to the following name and address:\n',
		Buyer.US_FirstName, ' ', Buyer.US_LastName, '\n',
		Delivery.AD_Line1, '\n',
		Delivery.AD_Line2, '\n',
		Delivery.AD_City, ', ', Delivery.AD_State, '\n',
		Delivery.AD_Country, ' ', Delivery.AD_PostCode))
FROM Purchase
	LEFT JOIN Listing ON PC_LS = LS_PK
	LEFT JOIN User AS Sys ON Sys.US_Username = 'System'
	LEFT JOIN User as Buyer ON Buyer.US_PK = PC_US_Buyer
	LEFT JOIN User as Seller ON Seller.US_PK = LS_US_Seller
	LEFT JOIN Address as Delivery ON PC_AD_Delivery = AD_PK
WHERE 
	PC_PK = ?;
	`;

	db.query(insertMessageQuery, [purchasePK], (err) => 
	{ 
		if (err)
		{
			console.trace(err);
		}
	});
}

exports.getPrePurchaseInformation = function(userPK, listingPK, amount, callback = { success: () => {}, fail: () => {} }) 
{
  const db = database.connectDatabase();
  let paymentMethodsQuery = `
SELECT
	PM_Nickname as paymentNickName,
    PM_Name as paymentName,
    PM_PK as paymentID,
    CASE WHEN PM_CardNumber IS NOT NULL AND LENGTH(PM_CardNumber) > 4
		THEN LPAD(SUBSTR(PM_CardNumber, -4), LENGTH(PM_CardNumber), '*') 
		ELSE PM_CardNumber
	END AS paymentNumber
FROM PaymentMethod
WHERE PM_US = ?
;`;         
  let sanitisedInputs = [userPK];
  db.query(paymentMethodsQuery, sanitisedInputs, (err, payments) => {
    console.log("GOT THE PAYMENT INFO");
    console.log(payments);

    if (err) {
        console.trace(err);
        callback.fail("Failed to retrieve payment options");
    }
    let addressQuery = `
    SELECT
      AD_Line1 as addressLine1,
      AD_Line2 as addressLine2,
      AD_City as addressCity,
      AD_State as addressState,
      AD_PostCode as addressPostCode,
        AD_Country as addressCountry,
        AD_PK as addressID
    FROM Address
    WHERE AD_US = ?
    ;`;
    let sanitisedInputs2 = [userPK];
    db.query(addressQuery, sanitisedInputs2, (err, addresses) => {
        console.log("GOT THE address INFO");
        console.log(addresses);

        if (err) {
            console.trace(err);                
            callback.fail("Failed to retrieve address options");
        }
        let listingQuery = `
        SELECT
          LS_Title AS itemName,
            LS_Price AS itemPrice,
            LS_PK AS itemID, 
          LS_RemainingStock AS itemStockLeft
        FROM Listing
        WHERE
          LS_PK = ? AND
          LS_IsActive = 1
        LIMIT 1
        ;`;
      let sanitisedInputs3 = [listingPK];
      db.query(listingQuery, sanitisedInputs3, (err, listing) => {
          console.log("GOT THE listing INFO");
          console.log(listing);

          if (err) {
              console.trace(err);                    
              callback.fail("Failed to retrieve listing");
          }

          listing[0].addresses = addresses;
          listing[0].payments = payments;
          listing[0].requestQuantity = amount;
          callback.success(listing[0]);
      });
    });
  });
}

const getPurchasesByCheck = function(check, callback = { success: (purchases) => {}, fail: (reason) => {} })
{
	const db = database.connectDatabase();

	let query = `
		SELECT 
			PC_PK AS id,
			PC_LS AS listingID,
			LS_Title AS listingTitle,
			PC_PM AS paymentMethod,
			PC_US_Buyer AS buyerID,
			US_Username AS buyerUsername,
			PC_AD_Delivery AS addressID,
			PC_TrackingNumber AS trackingNumber,
			PC_Price AS price,
			PC_Quantity AS quantity,
			PC_Date AS date
		FROM Purchase
		LEFT JOIN User ON US_PK = PC_US_Buyer
		LEFT JOIN Listing ON LS_PK = PC_LS
	`
	query += " WHERE " + check;

	db.query(query, (err, results) =>
	{
		if (err)
		{
			console.trace("Failed to get purchases for user! " + err)
			callback.fail("Could not get purchases for user from the database");
		}
		else
		{
			callback.success(results);
		}
	})
}

exports.getPurchasesForUserID = function(userID, callback = { success: (purchases) => {}, fail: (reason) => {} })
{
	let db = database.connectDatabase();
	getPurchasesByCheck('PC_US_Buyer = ' + db.escape(userID), callback);
}

exports.getPurchasesForUser = function(user, callback = { success: (purchases) => {}, fail: (reason) => {} })
{
	this.getPurchasesForUserID(user.id, callback);
}

exports.getPurchasesForListingID = function(listingID, callback = { success: (purchases) => {}, fail: (reason) => {} })
{
	let db = database.connectDatabase();
	getPurchasesByCheck('PC_LS = ' + db.escape(listingID), callback);
}

exports.getPurchasesForListing = function(listing, callback = { success: (purchases) => {}, fail: (reason) => {} })
{
	this.getPurchasesForListingID(listing.id, callback);
}

/**
 * Modify a listing.
 * @param {} listing The updated listing model.
 * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.modifyListing = function(listing, callback = { success: () => {}, fail: () => {}, done: () => {} })
{
	this.modifyListingByID(listing.id, listing, callback);
}

/**
 * Turns a listing into active state.
 * @param {string} listingID The listing id.
 * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.openListing = function(listingID, callback = { success: () => {}, fail: () => {}, done: () => {} }) {
    this.modifyListingByID(listingID, { isActive: true }, callback);
}

/**
 * Turns a listing into an inactive state.
 * @param {string} listingID The listing id.
 * @param {} callback callbacks with success() if successful, fail() if failed, and done() when done. Note that done() is called after fail() or success().
 */
exports.closeListing = function(listingID, callback = { success: () => {}, fail: () => {}, done: () => {} }) {
    this.modifyListingByID(listingID, { isActive: false }, callback);
}

exports.getListingsForUserByID = function(userID, callback = { success: (results) => {}, fail: (reason) => {} }) {
    const db = database.connectDatabase();
    let query = `
		SELECT * FROM Listing
		INNER JOIN User ON Listing.LS_US_Seller = User.US_PK
		LEFT JOIN Attachment ON LS_PK = AT_ParentPK AND AT_ParentID = 'LS' AND AT_Type = 'IMG'
		WHERE Listing.LS_US_Seller = ?
	`
    db.query(query, [userID], (err, results) => {
        if (err) {
            let reason = 'Failed to get listings for user';
            console.trace(reason + ' ' + err);
            callback.fail(reason);
        } else {
            let newResults = [];

            for (rawResult of results) {
                let obj = this.convertToListingObject(rawResult);
                obj.user = userModel.convertToUserObject(rawResult);
                newResults.push(obj);
            }
            callback.success(newResults);
        }
    })
}

exports.getListingsForUser = function(user, callback = { success: (results) => {}, fail: (reason) => {} }) {
    this.getListingsForUserByID(user.id, callback);
}