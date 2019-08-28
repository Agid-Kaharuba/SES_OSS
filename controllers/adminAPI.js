const express = require("express");

const router = express.Router();

// Every method is prepended with "/admin" see app.js

router.post('/login', (req, res) => 
{

})

router.get('/homepage', (req, res) => 
{

})

router.post('/search_user/', (req, res) => 
{

})

router.post('/add_user/', (req, res) => 
{

})

router.post('/delete_user/:id', (req, res) => 
{

})

router.post('/add_listing/', (req, res) => 
{

})

router.post('/remove_listing', (req, res) => 
{

})

module.exports = {router};