var express = require('express'),
app = express();

app.set('view engine', 'ejs');


/* 
database will contain images, sellernames, product names 
image:"" 
LS_sellerName=""
LS_productName=""

*/



//listings 
app.get('/listings/Search',function(req,res){
    res.render('listing', {userQuery: req.params.userQuery} , {searchResults: userQuery, userQuery, userQuery} );
    
})


app.listen(8080, function(){
    console.log("server is running");

})
