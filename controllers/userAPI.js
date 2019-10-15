const express = require('express');
const baseView = require('../views/base')
const userModel = require('../models/user');
const listingModel = require('../models/listing');
const jsonResponse = require('../utils/JSONResponse');
const htmlResponse = require('../utils/HTMLResponse');
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
                () => htmlResponse.fail(req, res, 'Could not register an already existing user', 'Registration Failure'),
			notFound: 
				() => userModel.registerUser(user,
				{
					success:
						() => res.redirect("/?register=success"),
					fail:
						(reason) => htmlResponse.fail(req, res, reason)
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
						res.redirect("/?login=success");
					},
					fail: () => htmlResponse.fail(req, res, 'Failed to create a new session', 'Failed to login')
				}),
			fail:
				(reason) => htmlResponse.fail(req, res, reason, 'Failed to login')
		});
});

router.get('/profile', (req, res) => 
{
    
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.getUserProfileInfo(user.id, 
        {
            found: (userProfile, userAddress, userPayment) =>
            {
                var userInfo =
                {
                    profile: userProfile,
                    address: userAddress,
                    payment: userPayment
                }
                console.log(userInfo);
                baseView.renderWithAddons(req, res, 'pages/userDashboard/userProfileView', {userInfo});
            },
            notFound: () =>
            {
                htmlResponse.fail(req, res, "Failed to get user profile!")
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
				res.redirect("/?logout=success");
			},
			fail: () => htmlResponse.fail(req, res, 'Failed to logout', 'Logout failure')
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
                cvc : req.body.editPayment_CVC,
            }; 

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.createUserPayment(user.id, editData,
        {
            success: () => 
            {
                res.redirect('/user/profile');
            }, 
            fail: () => {}
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

router.get('/userListings', (req, res) =>
{
    baseView.renderWithCallback(req, res, 'pages/userDashboard/userListings', (user, isAdmin, next) =>
    {
        listingModel.getListingsForUser(user, 
        {
            success: (results) => next({results}),
            fail: (reason) => htmlResponse.fail(req, res, reason, 'Failed to get user listings')
        })
    })
})

router.get('/public/profile/id=:id', (req, res) =>
{
    baseView.renderWithCallback(req, res, 'pages/user/publicProfile', (user, isAdmin, next) =>
    {
        userModel.getUserFromID(req.params.id, 
        {
            found: (user) =>
            {
                let targetUser = user;
                listingModel.getListingsForUserByID(req.params.id, 
                {
                    success: (results) => next({targetUser, results}),
                    fail: (reason) => htmlResponse.fail(req, res, reason, 'Failed to get user listings')
                })
            },
            notFound: () => htmlResponse.fail(req, res, 'Failed to find user')
        })
    })
})

router.get('/userPurchases', auth.authorizeUser, (req, res) =>
{
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        listingModel.getPurchasesForUser(user,
        {
            success: (purchases) => baseView.renderFromInfo(req, res, 'pages/userDashboard/userPurchases', {user, isAdmin, purchases}),
            fail: (reason) => htmlResponse.fail(req, res, reason, "Failed to get purchases for user!")
        })
    })
})

module.exports = { router };