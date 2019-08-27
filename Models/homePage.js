var path = require('path');

exports.cb0 = function (req, res) 
{
	res.sendFile(path.join(__dirname, '../html', 'bookstrapnew.html'));
};