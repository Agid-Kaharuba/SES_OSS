const baseView = require('../views/base');

/**
 * Generic response
 */
exports.respond = function(req, res, response = {})
{
    if (!response.hasOwnProperty('title')) 
    {
        response.title = 'Response';
    }

    if (!response.hasOwnProperty('description')) 
    {
        response.description = 'No additional description.';
    }
    this.redirectToResponse(res, response);
}

/**
 * A more complete version of htmlResponse#success(), you usually want to use htmlResponse#success() in most cases.
 */
exports.successResponse = function(req, res, response = {})
{
	if (!response.hasOwnProperty('title')) 
    {
        response.title = 'Success';
    }
    response.success = true;
    this.redirectToResponse(res, response);
}

/**
 * A more complete version of htmlResponse#fail(), you usually want to use htmlResponse#fail() in most cases.
 */
exports.failResponse = function(req, res, response = {})
{
    if (!response.hasOwnProperty('title')) 
    {
        response.title = 'Fail';
    }
    response.success = false;
    this.redirectToResponse(res, response);
}

/**
 * Render a html page with a successful response.
 */
exports.success = function(req, res, reason, title = 'Success')
{
    exports.successResponse(req, res, {title: title, description: reason});
}

/**
 * Render a html page with a fail response.
 */
exports.fail = function(req, res, reason, title = 'Fail')
{
    exports.failResponse(req, res, {title: title, description: reason});
}

exports.redirectToResponse = function(res, response)
{
    res.cookie('response-info', response, {httpOnly: true});
    res.redirect('/response');
}

exports.renderResponse = function(req, res)
{
    let response = req.cookies['response-info'];
    if (!response) response = {};
    if (!response.title || !response.description) 
    {
        response.success = false;
        response.title = "Error!";
        response.description = "Something went really wrong :(";
    }
    baseView.renderWithAddons(req, res, 'pages/response', {response});
}
