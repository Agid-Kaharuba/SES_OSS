const express = require('express');
const baseView = require('../views/base')
const userModel = require('../models/user');
const listingModel = require('../models/listing');
const jsonResponse = require('../utils/JSONResponse');
const auth = require('../utils/authUtil');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest : 'attachment/IMG/'});

// Every method is prepended with "/user" see app.js

router.post('/register', (req, res) =>
{
	var user = req.body;
	userModel.checkUserExists(user.username,
		{
			found: 
				() => res.send(jsonResponse.fail("Could not register an already existing user")),
			notFound: 
				() => userModel.registerUser(user,
				{
					success:
						() => res.redirect("/?register=success"),
					fail:
						(reason) => res.send(jsonResponse.fail(reason))
				})
		});
});

router.post('/login', (req, res) =>
{
	console.log(req.body);
	userModel.loginUser(req.body.username, req.body.password,
		{
			success:
				(user) => auth.attach(res, user,
				{
					success: () => 
					{
						res.cookie("currentUser", user.username);
						res.redirect("/?login=success");
					},
					fail: () => res.send(jsonResponse.fail('Failed to create a new session'))
				}),
			fail:
				(reason) => res.send(jsonResponse.fail(reason)),
		});
});

router.get('/profile', (req, res) => 
{
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.getUserProfileInfo(user.id, 
        {
            found: (userProfile) =>
            {
                res.render('pages/userDashboard/userProfileView', {userProfile});
            },
            notFound: () =>
            {

            }
        });
    });
});


router.get('/logout', (req, res) =>
{
	auth.invalidateSession(req, 
		{
			success: () => 
			{
				res.cookie('currentUser', "", {maxAge: Date.now()});
				res.redirect("/?logout=success");
			},
			fail: () => res.send(jsonResponse.fail('Failed to logout'))
		});
});

router.get('/profile/editProfile', (req, res) => {
    res.render('pages/userDashboard/editProfileView');
});

router.post('/profile/editProfile', (req, res) =>
{                   
    var editData = 
            {
                firstName : req.body.editProfile_firstName,
                lastName : req.body.editProfile_lastName,
                DOB: req.body.editProfile_DOB,
                phoneNumber : req.body.editProfile_phoneNumber
            };

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.modifyUserByID(user.id, editData,
        {
            success: () => 
            {
                res.redirect('/user/profile');
            }, 
            fail: () => {}, 
            done: () => {}
        });
    });

});

router.get('/profile/editAddress', (req, res) => {
    res.render('pages/userDashboard/editAddressView');
});

router.get('/profile/addAddress', (req, res) => {
    res.render('pages/userDashboard/addAddressView');
});

router.post('/profile/addAddress', (req, res) =>
{                   
    var editData = 
            {
                addressLine1 : req.body.editAddress_line1,
                addressLine2 : req.body.editAddress_line2,
                city : req.body.editAddress_city,
                state : req.body.editAddress_state,
                country : req.body.editAddress_country,
                postcode : req.body.editAddress_postcode
            }; 

    console.log('were atlaest getting here');
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.createUserAddress(user.id, editData,
        {
            success: () => 
            {
                res.redirect('/user/profile');
            }, 
            fail: () => {}, 
            done: () => {}
        });
    }); 

});

router.post('/profile/editAddress', (req, res) =>
{                   
    var editData = 
            {
                addressLine1 : req.body.editAddress_line1,
                addressLine2 : req.body.editAddress_line2,
                city : req.body.editAddress_city,
                state : req.body.editAddress_state,
                country : req.body.editAddress_country,
                postcode : req.body.editAddress_postcode
            }; 

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.modifyUserAddressByID(user.id, editData,
        {
            success: () => 
            {
                res.redirect('/user/profile');
            }, 
            fail: () => {}, 
            done: () => {}
        });
    }); 

});

router.get('/profile/editPayment', (req, res) => {
    res.render('pages/userDashboard/editPaymentView');
});
router.get('/profile/addPayment', (req, res) => {
    res.render('pages/userDashboard/addPaymentView');
});

router.post('/profile/addPayment', (req, res) =>
{                   
    var editData = 
            {
                nickName : req.body.editPayment_nickname,
                name : req.body.editPayment_cardholderName,
                number : req.body.editPayment_number,
                exp : req.body.editPayment_Expiry,
                cvv : req.body.editPayment_CVV,
            }; 

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.createUserPayment(user.id, editData,
        {
            success: () => 
            {
                res.redirect('/profile');
            }, 
            fail: () => {}, 
            done: () => {}
        });
    });

});

router.post('/profile/editPayment', (req, res) =>
{                   
    var editData = 
            {
                nickName : req.body.editPayment_nickname,
                name : req.body.editPayment_cardholderName,
                number : req.body.editPayment_number,
                exp : req.body.editPayment_Expiry,
                cvv : req.body.editPayment_CVV,
            }; 

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.modifyUserPaymentByID(user.id, editData,
        {
            success: () => 
            {
                res.redirect('/profile');
            }, 
            fail: () => {}, 
            done: () => {}
        });
    });

});

router.get('/profile/createAd', (req, res) =>
{
    res.render('pages/userDashboard/createAd');
});

router.post('/profile/createAd', upload.single('productImage'), (req, res) =>
{
    var listing = 
    {
        title : req.body.productName,
        description : req.body.productDescription,
        price : req.body.productPrice,
        remainingStock : req.body.productStock,
        fileName : req.file.productImage
    }

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        listingModel.createListingForUserID(user.id, listing,
            {
                success: () =>
                {
                    res.redirect('/user/profile');
                },
                fail: () => {},
                done: () => {}
            });
    });

});

router.put('/modify', (req, res) =>
{

});

router.get('/purchase/:listingID', (req, res) =>
{

});

router.post('/confirm_purchase/:listingID', (req, res) =>
{

});

router.get('/', (req, res) =>
{

});

module.exports = { router };