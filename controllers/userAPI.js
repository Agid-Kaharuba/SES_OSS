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
const dateUtil = require('../utils/dateUtil');

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

router.get('/profile', auth.authorizeUser, (req, res) => 
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
                baseView.renderFromInfo(req, res, 'pages/userDashboard/userProfileView', {userInfo, user, isAdmin});
            },
            notFound: (reason) =>
            {
                htmlResponse.fail(req, res, reason, "Failed to get user profile!")
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

router.post('/profile/editProfile', auth.authorizeUserJson, (req, res) =>
{                   
    var editData = req.body;
    dateUtil.fillPropertyFromHTML(editData, 'DOB');
    console.log("Got edit ", editData);

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.modifyUserByID(user.id, editData,
        {
            success: () => res.send(jsonResponse.success()),
            fail: () => res.send(jsonResponse.fail("Failed to modify user"))
        });
    });
});

router.post('/profile/addAddress', auth.authorizeUser, (req, res) =>
{                   
    var editData = req.body;

    console.log('were atlaest getting here');
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.createUserAddress(user.id, editData,
        {
            success: () => 
            {
                res.redirect('/user/profile');
            }, 
            fail: () => htmlResponse.fail(req, res, "Failed to add new address!"), 
        });
    }); 

});

router.post('/profile/editAddress', auth.authorizeUser, (req, res) =>
{                   
    var editData = req.body;

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.modifyUserAddress(editData,
        {
            success: () => 
            {
                res.redirect('/user/profile');
            }, 
            fail: () => htmlResponse.fail(req, res, "Failed to edit existing address!"), 
        });
    }); 

});

router.post('/profile/addPayment', auth.authorizeUser, (req, res) =>
{                   
    var editData = req.body;
    dateUtil.fillPropertyFromHTML(editData, 'exp');

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.createUserPayment(user.id, editData,
        {
            success: () => 
            {
                res.redirect('/user/profile');
            }, 
            fail: () => htmlResponse.fail("Failed to add new payment")
        });
    });

});

router.post('/profile/editPayment', auth.authorizeUser, (req, res) =>
{
    let editData = req.body;
    dateUtil.fillPropertyFromHTML(editData, 'exp');

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.modifyUserPaymentByID(user.id, editData,
        {
            success: () => 
            {
                res.redirect('/profile');
            }, 
            fail: () => htmlResponse.fail("Failed to edit existing payment"),
        });
    });

});

router.get('/profile/createAd', auth.authorizeUser, (req, res) =>
{
    baseView.renderWithAddons(req, res, 'pages/userDashboard/createAd');
});

router.post('/profile/createAd', auth.authorizeUser, upload.single('fileName'), (req, res) =>
{
    var listing = req.body;

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        listingModel.createListingForUserID(user.id, listing,
        {
            success: () =>
            {
                res.redirect('/user/profile');
            },
            fail: () => htmlResponse.fail(req, res, "Failed to create new listing"),
        });
    });

});

router.get('/userListings', auth.authorizeUser, (req, res) =>
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

router.get('/pastListings', auth.authorizeUser, (req, res) =>
{
    baseView.renderWithCallback(req, res, 'pages/userDashboard/pastListings', (user, isAdmin, next) =>
    {
        listingModel.getListingsForUser(user, 
        {
            success: (results) => next({results}),
            fail: (reason) => htmlResponse.fail(req, res, reason, 'Failed to get user listings')
        })
    })
})

router.get('/public/profile/id=:id', auth.authorizeUser, (req, res) =>
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

router.post('/resetPassword/username=:username', auth.authorizeUserJson, (req, res) =>
{
    console.log("Got reset pass ", req.body);
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        if (isAdmin || user.username == req.params.username)
        {
            userModel.modifyPasswordByUsername(req.params.username, req.body.password, 
            {
                success: () => res.send(jsonResponse.success()),
                fail: () => res.send(jsonResponse.fail("Failed to reset password"))
            })
        }
    })
})

module.exports = { router };