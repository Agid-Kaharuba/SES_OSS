const express = require('express');
const baseView = require('../views/base')
const userModel = require('../models/user');
const listingModel = require('../models/listing');
const jsonResponse = require('../utils/JSONResponse');
const htmlResponse = require('../utils/HTMLResponse');
const auth = require('../utils/authUtil');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dateUtil = require('../utils/dateUtil');
const uuid = require('uuid');

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

router.post('/profile/addAddress', (req, res) =>
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

router.post('/profile/editAddress', (req, res) =>
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
            fail: () => htmlResponse.fail(req, res, "Failed to edit existing address!")
        });
    }); 

});

router.post('/profile/deleteAddress', auth.authorizeUser, (req, res) =>
{                   
    var editData = req.body;

    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        userModel.deleteAddress(editData,
        {
            success: () =>
            {
                res.redirect('/user/profile');
            },
            fail: () =>
            {
                htmlResponse.fail(req, res, "Failed to edit existing address!");
            }
        });
    })
});

router.post('/profile/addPayment', (req, res) =>
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

router.post('/profile/editPayment', (req, res) =>
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

router.get('/profile/createAd', (req, res) =>
{
    baseView.renderWithAddons(req, res, 'pages/userDashboard/createAd');
});

var storage = multer.diskStorage(
    {
        destination: 'attachment/IMG/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            
            cb( null, file.originalname);
        }
    }
);
var upload = multer( { storage: storage } );

router.post('/profile/createAd', (req, res) =>
{
    console.log(req.body);
    var listing = req.body;
    var listingPK = uuid.v4();
    console.log(req.body.remainingStock);
    upload.single('fileName');

    renameMostRecentImgTo(listingPK);
    
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        listingModel.createListingForUserID(listingPK, user.id, listing,
        {
            success: () =>
            {
                res.redirect('/user/profile');
            },
            fail: () => htmlResponse.fail(req, res, "Failed to create new listing"),
        });
    });
});

function renameMostRecentImgTo(newName)
{
    var dirpath = __dirname + "/../attachment/IMG/";
    // Check if dirpath exist or not right here
  
    let latest;
  
    const files = fs.readdirSync(dirpath);
    files.forEach(filename => {
      // Get the stat
      const stat = fs.lstatSync(path.join(dirpath, filename));
      // Pass if it is a directory
      if (stat.isDirectory())
        return;
  
      // latest default to first file
      if (!latest) {
        latest = {filename, mtime: stat.mtime};
        return;
      }
      // update latest if mtime is greater than the current latest
      if (stat.mtime > latest.mtime) {
        latest.filename = filename;
        latest.mtime = stat.mtime;
      }
    });
  
    fs.rename(dirpath + latest.filename, dirpath + newName + ".jpg", (err) => { if (err) console.trace(err); });
  }

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

router.get('/pastListings', (req, res) =>
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