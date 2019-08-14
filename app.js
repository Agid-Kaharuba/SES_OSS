const http = require('http');
const express = require("express");
const mysql = require("mysql");

//Create connection
const db = mysql.createConnection(
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
		console.log("Thrown 0001");
		throw err;
	}
	console.log("MySql Connected...")
});

const app = express();

app.get('/test', (req, res) =>
{
	res.sendFile(__dirname + "/html/bookstrapnew.html");
});

app.use('/images', express.static('images'));
app.use('/styles', express.static('html/styles'));
app.use(express.static('js'));

// Create DB
app.get('/create_db', (req, res) =>
{
	let sql = 'CREATE DATABASE my_db';
	db.query(sql, (err, result) =>
	{
		if (err)
		{
			throw err;
		}
		console.log(result);
		res.send("Database Created...");
	});
});

//Create table
app.get('/createpoststable', (req, res) =>
{
	let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))'
	db.query(sql, (err, result) =>
	{
		if (err)
		{
			throw err;
		}
		console.log(result);
		res.send('Posts table created...');
	})
});

app.listen("3000", () => 
{
    console.log("Server started on port 3000");
});

