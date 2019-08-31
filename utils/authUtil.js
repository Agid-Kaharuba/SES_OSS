const jsonResponse = require('./JSONResponse');
const jwt = require('jsonwebtoken');

exports.validate = function(req, callback = function(err, decoded) {}) 
{
    if (!req.cookies.hasOwnProperty('jwt')) callback(new Error("No cookie with token found!"), null);
    let token = req.cookies['jwt'];
    jwt.verify(token, process.env.SECRET, callback);
}

exports.validateOrFail = function(req, res, callback = function(decoded) {}) 
{
    this.validate(req, (err, decoded) => 
    {
        if (!err) 
        {
            callback(decoded);
        }
        else
        {
            res.send(jsonResponse.fail('Invalid Auth token!'));
        }
    });
}

exports.attach = function(res, payload, options = {expiresIn: '12h'})
{
    let token = jwt.sign({data: payload}, process.env.SECRET, options);
    res.cookie('jwt', token, {httpOnly: true, expiresIn: options.expiresIn});
}