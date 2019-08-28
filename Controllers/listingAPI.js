const express = require('express');

const router = express.Router();

// Every method is prepended with "/listing" see app.js

router.get('/:id', (req, res) => {
    console.log('Receieved req for listing id: ' + req.params.query); // Example params usage.
})

router.get('/search/:query', (req, res) => {
    console.log('Received query: ' + req.params.query); // Example params usage.
})

module.exports = {router};