var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/order', function(req, res, next) {
    res.render('order', { title: 'Express' });
});
module.exports = router;
