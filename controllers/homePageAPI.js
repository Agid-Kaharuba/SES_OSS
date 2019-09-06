const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
{
	console.log("Receieved req for homePage listings");
	res.render('pages/home')
});

router.get('/confirmPurchase', (req, res) =>
{
	res.render('pages/confirmPurchase')
});

router.get('/paymentSummary', (req, res) =>
{
	res.render('pages/paymentSummary')
});

module.exports = { router };