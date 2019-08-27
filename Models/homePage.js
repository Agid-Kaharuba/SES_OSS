var path = require('path');

var cb0 = function (req, res) 
{
	res.sendFile(path.join(__dirname, '../html', 'bookstrapnew.html'));
};

module.exports = { cb0 };