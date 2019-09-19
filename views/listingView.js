
//this is for displaying the many listings when a user searches
//the 'listings' parameter will pass in the following data.
//[ RowDataPacket 
//	{
//    sellerUsername: 'Bob',
//    listingTitle: 'hello'
//	}
// ... Followed by many more 'RowDataPackets' 
//]
// Note; you might have to account for the fact where there are no listings found
exports.viewListings = function(listings) 
{

}

//this is for displaying a single listing when on a listing's page.
//the 'listings' parameter will pass in the following data.
//[ RowDataPacket 
//	{
//    sellerUsername: 'Bob',
//    listingTitle: 'hello'
//	}
//]
// Note; you might have to account for the fact where there are no listings found
exports.viewListing = function(listing) 
{

}

//this is for displaying the summary of a purchase after a purchase has been completed.
//the 'fields' parameter will pass in something in the template the following data
// RowDataPacket {
// 	listingTitle: 'Item Title',
// 	listingDescription: 'Item Description',
// 	listingID: 'a2f6da3c-da70-11e9-a859-256794b0b57d',
// 	sellerUsername: 'Seller',
// 	purchaseID: '2156c02c-da71-11e9-a859-256794b0b57d',
// 	purchasePrice: 100,
// 	purchaseDate: 2019-09-19T00:05:03.000Z,
// 	purchaseQuantity: 2,
// 	deliveryLine1: 'Line1',
// 	deliveryLine2: 'Line2',
// 	deliveryCity: 'Sydney',
// 	deliveryState: 'New South Wales',
// 	deliveryPostCode: '2143',
// 	deliveryCountry: 'Australia',
// 	paymentNickname: 'MyAccount',
// 	paymentName: null,
// 	paymentNumber: '************4444' }
exports.viewPurchaseSummary = function(fields) 
{
	return fields;
}