const path = require('path');
const db = require('../utils/database');

exports.cb0 = function (req, res) 
{
	res.sendFile(path.join(__dirname, '../public/homePage', 'homePage.html'));
};

exports.checkUserDoesntAlreadyExist = function (req, res, next) 
{
	
// 	res.sendFile(path.join(__dirname, '../public/homePage', 'homePage.html'));
};

exports.validateUserLogin = function(user, callback = {success: () => {}, fail: () => {}}) 
{
	db.selectUser(user.username, (err, results, fields) => 
	{
		let found = false;

		for (var i = 0; i < results.length; i++)
		{
			// Later implement hash passwords check
			if (results[i].US_Password == user.password)
			{
				found = true;
				break;
			}
		}
		
		if (found)
		{
			callback.success();
		}
		else
		{
			callback.fail();
		}
	})
}