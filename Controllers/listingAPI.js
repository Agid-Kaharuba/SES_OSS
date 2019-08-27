const express = require('express');

const router = express.Router();

router.get('/listing/:id', (req, res) => {
    console.log('Receieved req for listing id: ' + req.params.query); // Example params usage.
})

router.get('/listing/search/:query', (req, res) => {
    console.log('Received query: ' + req.params.query); // Example params usage.
})

module.exports = {router};