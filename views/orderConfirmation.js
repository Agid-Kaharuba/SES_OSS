var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "temp"
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM user", function (err, result, fields) {
        if (err) throw err;
        console.log('connection successful');
    });
});
router.post('/', function(req, res) {

    console.log(req.body);
    res.write('You sent the name "' + req.body.name+'".\n');
    res.write('You sent the Email "' + req.body.email+'".\n');
    res.write('You sent the address "' + req.body.address+'".\n');
    res.write('You sent the city "' + req.body.city+'".\n');
    res.write('You sent the cardname "' + req.body.cardname+'".\n');
    res.write('You sent the card number "' + req.body.cardnumber+'".\n');
    res.write('You sent the card exp month "' + req.body.expmonth+'".\n');
    res.write('You sent the card exp year "' + req.body.expyear+'".\n');
    res.write('You sent the card cvv number "' + req.body.cvv+'".\n');
    res.end()


});

router.get('/', function(req, res, next) {
    res.render('order', { title: 'Express' });
});
module.exports = router;

