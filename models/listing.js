const database = require('../utils/database');

exports.GetListing = function (listingPK, callback) 
{
	var db = database.connectDatabase();
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

	var listing = db.query(query, [listingPK], callback);
	return listing;
}

exports.SearchListings = function (searchTerm, callback) 
{
	var db = database.connectDatabase();
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

	db.query(query, [searchTerm], callback);
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
			found(results[0]);
			return
		}
		else
		{
			notFound();
			return;
		}
	});
}
