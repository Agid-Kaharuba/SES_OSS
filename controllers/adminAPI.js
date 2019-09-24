const express = require('express');
const jsonResponse = require('../utils/JSONResponse');
const userModel = require('../models/user')
const adminModel = require('../models/admin');
const auth = require('../utils/authUtil');

const router = express.Router();

// Every method is prepended with "/admin" see app.js

router.get('/dashboard', (req, res) => 
{

})

router.post('/add_user=:id', (req, res) => 
{

})

router.post('/delete_user=:id', (req, res) => 
{
    adminModel.deleteUser(req.params.id,
    {
        success: () => res.send(jsonResponse.success()),
        fail: (reason) => {res.send(jsonResponse.fail(reason))}
    })
})

router.post('/add_listing/', (req, res) => 
{

})

router.post('/remove_listing', (req, res) => 
{

})

router.post('/give_admin_userid=:id', adminModel.authorizeAdmin, (req, res) =>
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

router.post('/revoke_admin_userid=:id', adminModel.authorizeAdmin, (req, res) =>
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

module.exports = {router};