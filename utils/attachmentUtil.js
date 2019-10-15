//gets passed in the dir of their file, (possibly null)
//if null or doesnt exist, return (image not found) img dir,
//otherwise return the dir of the img passed in
const fs = require("fs");

exports.getImgPath = function(jpgImgName)
{
	var baseDir = __dirname + "/../attachment/IMG/";
	var imgDir = jpgImgName + '.jpg';
	console.log(baseDir + imgDir);
	if (jpgImgName != null && fs.existsSync(baseDir + imgDir))
	{
		return imgDir;
	}
	else
	{
		return 'default.jpg';;
	}
}