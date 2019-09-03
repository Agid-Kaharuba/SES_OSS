
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