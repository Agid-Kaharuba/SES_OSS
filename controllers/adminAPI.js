const express = require('express');
const jsonResponse = require('../utils/JSONResponse');
const userModel = require('../models/user')
const adminModel = require('../models/admin');
const view = require('../views/adminView');
const baseView = require('../views/base')
const auth = require('../utils/authUtil');

const router = express.Router();

// Every method is prepended with "/admin" see app.js

router.get('/dashboard', auth.authorizeAdmin, (req, res) => 
{
    baseView.renderWithAddons(req, res, 'pages/adminDashboard/dashboard');
})

router.get('/listingManagement', auth.authorizeAdmin, (req, res) => 
{
    baseView.renderWithAddons(req, res, 'pages/adminDashboard/listingManagement');
})

router.get('/userManagement', auth.authorizeAdmin, (req, res) => 
{
    baseView.renderWithAddons(req, res, 'pages/adminDashboard/userManagement');
})

router.get('/adminPrivileges', auth.authorizeAdmin, (req, res) => 
{
    const renderWith = (results) => baseView.renderWithAddons(req, res, 'pages/adminDashboard/adminPrivileges', {results});

    adminModel.getAllAdmins(
    {
        success: (results) => renderWith(results),
        fail: (reason) => renderWith([])
    })
})

router.post('/add_user=:id', auth.authorizeAdmin, (req, res) => 
{

})

router.post('/delete_user=:id', auth.authorizeAdmin, (req, res) => 
{
    adminModel.deleteUser(req.params.id,
    {
        success: () => res.send(jsonResponse.success()),
        fail: (reason) => {res.send(jsonResponse.fail(reason))}
    });
})

router.post('/add_listing/', auth.authorizeAdmin, (req, res) => 
{

})

router.post('/delete_listing=:id', auth.authorizeAdmin, (req, res) => 
{
    adminModel.deleteListing(req.params.id, 
    {
        success: () => res.send(jsonResponse.success()),
        fail: (reason) => res.send(jsonResponse.fail(reason))
    });
})

router.post('/give_admin_userid=:id', auth.authorizeAdmin, (req, res) =>
{
    userModel.checkUserExistsByID(req.params.id, 
    {
        found: () => adminModel.giveUserAdminPrivileges(req.params.id, 
        {
            success: () => res.send(jsonResponse.success()),
            fail: (reason) => res.send(jsonResponse.fail(reason))
        }),
        notFound: () => res.send(jsonResponse.fail('User does not exist!'))
    });
})

router.post('/revoke_admin_userid=:id', auth.authorizeAdmin, (req, res) =>
{
    userModel.checkUserExistsByID(req.params.id, 
    {
        found: () => adminModel.revokeUserAdminPrivileges(req.params.id, 
        {
            success: () => res.send(jsonResponse.success()),
            fail: (reason) => res.send(jsonResponse.fail(reason))
        }),
        notFound: () => res.send(jsonResponse.fail('User does not exist!'))
    });
})



module.exports = { router };
