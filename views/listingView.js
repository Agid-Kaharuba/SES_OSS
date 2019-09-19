
//this is for displaying the many listings when a user searches
//the 'listings' parameter will pass in the following data.
//[ RowDataPacket 
//	{
//    sellerUsername: 'Bob',
//    listingTitle: 'hello'
//	  listingID: 'a2f6da3c-da70-11e9-a859-256794b0b57d'
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
//    listingTitle: 'hello',
//	  listingDescription: 'some description',
//	  listingPrice: 99.99,
// 	  remainingStock: 5,
//	}
//]
// Note; you might have to account for the fact where there are no listings found
exports.viewListing = function(listing) 
{

}