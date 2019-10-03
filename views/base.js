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