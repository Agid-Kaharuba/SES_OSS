//#region Requirements
var http = require('http');
var express = require("express");

var homePageAPI = require('./Controllers/homePageAPI');
var userAPI = require('./Controllers/userAPI');

var app = express();
app.use('/images', express.static('images'));
app.use('/styles', express.static('html/styles'));
app.use(express.static('js'));

//HOW TO USE - APP.USE
//app.use('directory the webpage is at when it should be used', 'what should be used')
app.use('/', homePageAPI.router);
app.use('/', userAPI.router);

//#endregion

app.listen("3000", () => 
{
    console.log("Server started on port 3000");
});

module.exports = express.router; //This is required if you're going to route to new classes.
