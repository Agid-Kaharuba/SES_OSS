const path = require('path');
const db = require('../utils/database');
const bcrypt = require('bcrypt')

exports.cb0 = function (req, res) 
{
	res.sendFile(path.join(__dirname, '../public/homePage', 'homePage.html'));
};

exports.checkUserExist = function (user, callback = {found: () => {}, notFound: () => {}}) 
{
	db.selectUser(user.username, (err, results) => 
	{
		if (!err && results.length > 0)
		{
			callback.found();
		}
		else
		{
			callback.notFound();
		}
	});
}

exports.registerUser = function(user, callback = {success: () => {}, fail: () => {}})
{
	bcrypt.hash(user.password, 10, (errHash, hash) => 
	{
		if (errHash) 
		{
			callback.fail();
			return;
		}
		
		db.registerUser(user, hash, (errDB) => 
		{
			if (errDB)
			{
				console.error("Error when registering user:", errDB);
				callback.fail();
			}
			else
			{
				callback.success();
			}
		});
	});
}

exports.validateUserLogin = function(user, callback = {success: () => {}, fail: () => {}}) 
{
	db.selectUser(user.username, (err, results, fields) => 
	{
		let found = false;

		results.forEach(result => bcrypt.compare(user.password, result.US_Password, (err, compareRes) =>
		{
			if (!found)
			{
				found = true;

				if (compareRes)
				{
					callback.success();
				}
				else
				{
					callback.fail();
				}
			} 
			else 
			{
				console.error("ERROR found multiple rows for the same username!!!");
			}
		}));
	});
}