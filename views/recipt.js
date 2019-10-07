var express = require('express');
var router = express.Router();

var mysql = require('mysql');

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
var pk=getname();
function getname() {
    con.query("select US_Username,PC_Quantity,AD_Line1,AD_Line2,AD_City,PC_Price,US_Email,PM_Nickname,PM_Expiry,PM_Name from user,purchase,address,paymentmethod where US_PK=purchase.PC_US_Buyer;", function (err, result, fields) {
        if (err) throw err;
        else
            return pk=result[0];
    });


}

/* GET home page. */
router.get('/recipt', function(req, res, next) {

    console.log(pk.US_Username);
    var s=5;
    res.render('recipt', { title: 'Express',user:pk.US_Username,qty:pk.PC_Quantity,adl1:pk.AD_Line1,adl2:pk.AD_Line2,ac:pk.AD_City,price:pk.PC_Price,email:pk.US_Email,nname:pk.PM_Nickname,exp:pk.PM_Expiry,total:pk.PC_Price*pk.PC_Quantity,ship:s,wt:pk.PC_Price*pk.PC_Quantity+s,crdn:pk.PM_Name });
});
module.exports = router;
