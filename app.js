const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var dotenv = require('dotenv');
const app = express();
dotenv.config();

const homePageAPI = require('./controllers/homePageAPI');
const userAPI = require('./controllers/userAPI');
const listingAPI = require('./controllers/listingAPI');
const adminAPI = require('./controllers/adminAPI');
const devAPI = require('./controllers/devAPI');
const messageAPI = require('./controllers/messageAPI');

app.use('/images', express.static('images'));
app.use('/styles', express.static('html/styles'));
app.use(express.static('js'));
// For parsing json.
app.use(express.json());
// To be able to read cookies.
app.use(bodyParser());
app.use(cookieParser());

//HOW TO USE - APP.USE
//app.use('directory the webpage is at when it should be used', 'what should be used')
app.use('/', homePageAPI.router);
app.use('/user', userAPI.router);
app.use('/listing', listingAPI.router);
app.use('/admin', adminAPI.router);
app.use('/dev', devAPI.router);
app.use('/message', messageAPI.router);

app.use('/images', express.static('public/images'));
app.use('/attachment', express.static('attachment'));
app.use('/styles', express.static('public/styles'));
app.use('/js', express.static('public/js'));
app.use('/public', express.static('public'));

app.set('view engine','ejs');

app.get('/confirmPurchase',function(req,res){
    ejs.renderFile('confirmPurchase'); 
});

var port = process.env.PORT || 3000
app.listen(port, () => 
{
    console.log("Server started on port " + port);
});

module.exports = express.router;
