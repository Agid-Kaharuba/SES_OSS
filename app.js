//#region Requirements
var http = require('http');
var express = require("express");
var mysql = require("mysql");

var homePageAPI = require('./Controllers/homePageAPI');

var app = express();
module.exports = express.router; //This is required if you're going to route to new classes.

app.use('/images', express.static('images'));
app.use('/styles', express.static('html/styles'));
app.use(express.static('js'));

app.use('/', homePageAPI.router);

//#endregion

//#region Database Connection

//Create connection
var db = mysql.createConnection(
{
    host        : "localhost",
    user        : "root",
	password    : "",
	database	: "my_db"
})

db.connect((err) =>
{
	if (err)
	{
		console.log("MySql Failed to Connect - comment out the 'throw err;' if it's messing you up");
		throw err;
	}
	console.log("MySql Connected...")
});

//#endregion

//#region Residual - use for reference on 'how-to-sql' until we've got some other functions going
// Create DB
// app.get('/create_db', (req, res) =>
// {
// 	let sql1 = 'DROP my_db';
// 	let sql = 'CREATE DATABASE my_db';
// 	db.query(sql, (err, result) =>
// 	{
// 		if (err)
// 		{
// 			throw err;
// 		}
// 		console.log(result);
// 		res.send("Database Created...");
// 	});
// });

//Create table
// app.get('/createpoststable', (req, res) =>
// {
// 	let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))'
// 	db.query(sql, (err, result) =>
// 	{
// 		if (err)
// 		{
// 			throw err;
// 		}
// 		console.log(result);
// 		res.send('Posts table created...');
// 	})
// });
//#endregion

app.listen("3000", () => 
{
    console.log("Server started on port 3000");
});
