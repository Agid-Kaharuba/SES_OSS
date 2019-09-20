const path = require('path');
const db = require('../utils/database');

exports.createSchema = function() 
{
	db.createSchema();
}

exports.populateDatabase = function() 
{
	db.populateDatabase();
}