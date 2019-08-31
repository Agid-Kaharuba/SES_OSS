const express = require('express');
const user = require('../models/user')
const view = require('../views/userView')
const jsonResponse = require('../utils/JSONResponse');
const auth = require('../utils/authUtil');

const router = express.Router();

// Every method is prepended with "/user" see app.js

router.post('/register*', [user.checkUserDoesntAlreadyExist]);



router.post('/login', (req, res) => 
{
    user.validateUserLogin(req.body.username, req.body.password, {
        success: () => {
            auth.attach(res, req.body.username);
            res.send(jsonResponse.success());
        },
        fail: () => {
            res.send(jsonResponse.fail('Invalid username or password'));
        }
    });
})

router.get('/view-account', (req, res) => 
{
     res.send(view.viewAccount());
})

router.put('/modify', (req, res) => 
{
    auth.validateOrFail(req, res, (username) => {
        // Do something here if valid
    });
})

router.get('/purchase/:listingID', (req, res) => 
{

})

router.post('/confirm_purchase/:listingID', (req, res) => 
{

})

module.exports = { router };