//#region Requirements
const http = require('http');
const express = require("express");

const homePageAPI = require('./Controllers/homePageAPI');
const userAPI = require('./Controllers/userAPI');
const listingAPI = require('./Controllers/listingAPI');
const adminAPI = require('./Controllers/adminAPI');

const app = express();
app.use('/images', express.static('images'));
app.use('/styles', express.static('html/styles'));
app.use(express.static('js'));

//HOW TO USE - APP.USE
//app.use('directory the webpage is at when it should be used', 'what should be used')
app.use('/', homePageAPI.router);
app.use('/user', userAPI.router);
app.use('/listing', listingAPI.router);
app.use('/admin', adminAPI.router);

//#endregion

app.listen("3000", () => 
{
    console.log("Server started on port 3000");
});

module.exports = express.router; //This is required if you're going to route to new classes.
