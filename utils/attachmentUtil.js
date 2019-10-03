//gets passed in the dir of their file, (possibly null)
//if null or doesnt exist, return (image not found) img dir,
//otherwise return the dir of the img passed in
const fs = require("fs");

exports.getImgPath = function(jpgImgName)
{
	var baseDir = __dirname + "/../attachment/IMG/";
	var defaultFile = baseDir + 'default.jpg';
	if (jpgImgName == null)
	{
		return defaultFile;
	}

	var imgDir = baseDir + jpgImgName + '.jpg';
	if (fs.existsSync(dir))
	{
		return jpgImgName;
	}
	else
	{
		return defaultFile;
	}
}