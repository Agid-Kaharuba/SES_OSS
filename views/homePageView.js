const path = require('path');

//this is for displaying the recent listings on the main page
//the 'listings' parameter will pass in the following data.
//[ RowDataPacket {
//    listingID: '4bb8590e-ce26-11e9-a859-256794b0b57d',
//    listingTitle: 'hello' } ]
// Note; you might have to account for the fact where there are no listings found
// In the future, we will also add images to this.
exports.viewHomePage = function(listings) 
{
	return path.join(__dirname, '../public/homePage', 'homePage.html');
}