const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const homePageAPI = require('./controllers/homePageAPI');
const userAPI = require('./controllers/userAPI');
const listingAPI = require('./controllers/listingAPI');
const adminAPI = require('./controllers/adminAPI');
const devAPI = require('./controllers/devAPI');

//HOW TO USE - APP.USE
//app.use('directory the webpage is at when it should be used', 'what should be used')
app.use('/', homePageAPI.router);
app.use('/user', userAPI.router);
app.use('/listing', listingAPI.router);
app.use('/admin', adminAPI.router);
app.use('/dev', devAPI.router);

app.use('/images', express.static('public/images'));
app.use('/styles', express.static('public/styles'));
app.use('/js', express.static('public/js'));
app.use(express.static('js'));
app.set('view engine', 'ejs');
var port = process.env.PORT || 3000
app.listen(port, () => 
{
    console.log("Server started on port " + port);
});

module.exports = express.router;
