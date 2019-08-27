var express = require('express');
var path = require('path');

//trying to move this function to homePage.js, but couldnt figure out how.
var cb0 = function (req, res) 
{
	res.sendFile(path.join(__dirname, '../html', 'bookstrapnew.html'));
};

module.exports = { cb0 };