const express = require('express');
const user = require('../Models/user')
const view = require('../views/userView')

const router = express.Router();

// Every method is prepended with "/user" see app.js

router.post('/register', [user.checkUserDoesntAlreadyExist]);

router.post('/login', (req, res) => {
    
    if (user.validateUserLogin(res.username, res.password)) {
        return view.loginSucess();
    } else {
        return view.loginFail();
    }
})

router.get('/view-account', (req, res) => {
    return view.viewAccount();
})

router.put('/modify', (req, res) => {

})

router.get('/purchase/:listingID', (req, res) => {

})

router.post('/confirm_purchase/:listingID', (req, res) => {

})

module.exports = { router };