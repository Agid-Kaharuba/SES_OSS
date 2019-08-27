const express = require('express');
const user = require('../Models/user')
const view = require('../views/userView')

const router = express.Router();

router.post('/user/register', [user.checkUserDoesntAlreadyExist]);

router.post('/user/login', (req, res) => {
    
    if (user.validateUserLogin(res.username, res.password)) {
        return view.loginSucess();
    } else {
        return view.loginFail();
    }
})

router.get('/user/view-account', (req, res) => {
    return view.viewAccount();
})

router.put('/user/modify', (req, res) => {

})

router.get('/user/purchase/:listingID', (req, res) => {

})

router.post('/user/confirm_purchase/:listingID', (req, res) => {

})

module.exports = { router };