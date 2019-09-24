const path = require('path');

exports.dashboard = function() 
{
    return path.join(__dirname, '../public/adminDashboard/dashboard.html');
}

exports.listingManagement = function() 
{
    return path.join(__dirname, '../public/adminDashboard/listingManagement.html');
}

exports.userManagement = function() 
{
    return path.join(__dirname, '../public/adminDashboard/userManagement.html');
}