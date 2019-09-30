//gets passed in the dir of their file, (possibly null)
//if null or doesnt exist, return (image not found) img dir,
//otherwise return the dir of the img passed in
const fs = require("fs");

exports.getImgPath = function(imgFileName)
{
	var defaultFile = 'default.jpg';
	if (imgFileName == null)
	{
		return defaultFile;
	}

	var dir = __dirname + "/../attachment/IMG/" + imgFileName;
	if (fs.existsSync(dir))
	{
		return imgFileName;
	}
	else
	{
		return defaultFile;
	}
}