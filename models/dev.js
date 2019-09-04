const path = require('path');
const db = require('../utils/database');

exports.createSchema = function(name, password) 
{
	return db.createSchema();
}