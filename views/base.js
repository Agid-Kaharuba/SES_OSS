const userModel = require('../models/user')

exports.renderWithAddons = function(req, res, path, extra = {})
{
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        extra.user = user;
        extra.isAdmin = isAdmin;
        res.render(path, extra);
    })
}

exports.renderFromInfo = function(req, res, path, info = {user: null, isAdmin: false})
{
    res.render(path, info);
}

exports.renderWithCallback = function(req, res, path, callback = (user, isAdmin, next) => next())
{
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        callback(user, isAdmin, (extra) =>
        {
            if (extra == undefined) extra = {};
            extra.user = user;
            extra.isAdmin = isAdmin;
            res.render(path, extra);
        })
    })
}