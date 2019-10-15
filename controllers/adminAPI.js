const express = require('express');
const jsonResponse = require('../utils/JSONResponse');
const userModel = require('../models/user');
const adminModel = require('../models/admin');
const view = require('../views/adminView');
const baseView = require('../views/base');
const auth = require('../utils/authUtil');
const htmlResponse = require('../utils/HTMLResponse');
const dateUtil = require('../utils/dateUtil');
const listingModel = require('../models/listing');
const multer = require('multer');
const upload = multer({dest : 'attachment/IMG/'});

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

router.post('/add_user=:id', auth.authorizeAdminJson, (req, res) => 
{

})

router.post('/delete_user=:id', auth.authorizeAdminJson, (req, res) => 
{
    adminModel.deleteUser(req.params.id,
    {
        success: () => res.send(jsonResponse.success()),
        fail: (reason) => {res.send(jsonResponse.fail(reason))}
    });
})

router.post('/add_listing/', auth.authorizeAdminJson, (req, res) => 
{

})

router.post('/delete_listing=:id', auth.authorizeAdminJson, (req, res) => 
{
    adminModel.deleteListing(req.params.id, 
    {
        success: () => res.send(jsonResponse.success()),
        fail: (reason) => res.send(jsonResponse.fail(reason))
    });
})

router.post('/give_admin_userid=:id', auth.authorizeAdminJson, (req, res) =>
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

router.post('/revoke_admin_userid=:id', auth.authorizeAdminJson, (req, res) =>
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

router.get('/userProfile/id=:id', auth.authorizeAdmin, (req, res) =>
{
    userModel.getUserFromID(req.params.id,
    {
        found: (targetUser) => 
        {
            userModel.getUserProfileInfo(req.params.id, 
            {
                found: (userProfile, userAddress, userPayment) =>
                {
                    var userInfo =
                    {
                        profile: userProfile,
                        address: userAddress,
                        payment: userPayment
                    }
                    baseView.renderWithAddons(req, res, 'pages/admin/userProfile', {userInfo, targetUser});
                },
                notFound: () =>
                {
                    htmlResponse.fail(req, res, "Failed to get user profile for admin!")
                }
            });
        },
        notFound: () => htmlResponse.fail(req, res, "Failed to get target user for admin!")
    })
    
})

router.post('/editProfile/id=:id', auth.authorizeAdmin, (req, res) =>
{
    var editData = req.body;
    dateUtil.fillPropertyFromHTML(editData, 'DOB');

    userModel.modifyUserByID(req.params.id, editData,
    {
        success: () => res.send(jsonResponse.success()),
        fail: () => res.send(jsonResponse.fail("Failed to modify user"))
    });
})

router.post('/addAddress/id=:id', auth.authorizeAdmin, (req, res) =>
{
    var editData = req.body;
    userModel.createUserAddress(req.params.id, editData,
    {
        success: () => 
        {
            res.redirect('../userProfile/id=' + req.params.id);
        }, 
        fail: () => htmlResponse.fail(req, res, "Failed to add new address!"), 
    });
})

router.post('/editAddress/id=:id', auth.authorizeAdmin, (req, res) =>
{
    var editData = req.body;

    userModel.modifyUserAddress(editData,
    {
        success: () => 
        {
            res.redirect('../userProfile/id=' + req.params.id);
        }, 
        fail: () => htmlResponse.fail(req, res, "Failed to edit existing address!"), 
    });
})

router.post('/addPayment/id=:id', auth.authorizeAdmin, (req, res) =>
{
    var editData = req.body;
    dateUtil.fillPropertyFromHTML(editData, 'exp');

    userModel.createUserPayment(req.params.id, editData,
    {
        success: () => 
        {
            res.redirect('../userProfile/id=' + req.params.id);
        }, 
        fail: () => htmlResponse.fail("Failed to add new payment")
    });
})

router.post('/editPayment/id=:id', auth.authorizeAdmin, (req, res) =>
{
    let editData = req.body;
    dateUtil.fillPropertyFromHTML(editData, 'exp');

    userModel.modifyUserPaymentByID(req.params.id, editData,
    {
        success: () => 
        {
            res.redirect('../userProfile/id=' + req.params.id);
        }, 
        fail: () => htmlResponse.fail("Failed to edit existing payment"),
    });
})

router.get('/createUserListing/id=:id', auth.authorizeAdmin, (req, res) =>
{
    userModel.getUserFromID(req.params.id, 
    {
        found: (targetUser) => baseView.renderWithAddons(req, res, 'pages/admin/createUserListing', {targetUser}),
        notFound: () => htmlResponse.fail(req, res, "Failed to get target user!")
    })
})

router.post('/createUserListing/id=:id', auth.authorizeAdmin, upload.single('fileName'), (req, res) =>
{
    listingModel.createListingForUserID(req.params.id, req.body,
    {
        success: () =>
        {
            res.redirect('./createUserListing/id=' + req.params.id);
        },
        fail: () => htmlResponse.fail(req, res, "Failed to create new listing from admin control"),
    });
})

router.get('/userPurchases/id=:id', auth.authorizeAdmin, (req, res) =>
{
    userModel.getUserFromID(req.params.id, 
    {
        found: (targetUser) => 
        {
            listingModel.getPurchasesForUser(req.params.id,
            {
                success: (purchases) => baseView.renderWithAddons(req, res, 'pages/admin/userPurchases', {purchases, targetUser}),
                fail: (reason) => htmlResponse.fail(req, res, reason, "Failed to get purchases for target user!")
            })
        },
        notFound: () => htmlResponse.fail(req, res, "Failed to get target user!")
    })
})


module.exports = { router };
