const express = require('express');
const jsonResponse = require('../utils/JSONResponse');
const htmlResponse = require('../utils/HTMLResponse');
const messageModel = require('../models/message');
const auth = require('../utils/authUtil');
const userModel = require('../models/user');
const adminModel = require('../models/admin');
const baseView = require('../views/base');

const router = express.Router();

router.get('/id=:id', auth.authorizeUser, (req, res) =>
{
    messageModel.getMessageByID(req.params.id, 
    {
        success: (message) =>
        {
            userModel.getUserInfo(req, (user, isAdmin) =>
            {
                if (message.userIDFrom == user.id || message.userIDTo == user.id)
                {
                    baseView.renderWithAddons(req, res, 'pages/message/message', {message});
                }
                else 
                {
                    htmlResponse.fail(req, res, 'Access is not allowed for the user for this message', 'Access not allowed');
                }
            })
        },
        fail: (reason) => htmlResponse.fail(req, res, reason)
    })
})

router.get('/inbox', auth.authorizeUser, (req, res) =>
{
    userModel.getUserInfo(req, (user, isAdmin) => 
    {
        messageModel.getMessagesForUser(user, 
        {
            success: (messages) => 
            {
                baseView.renderWithAddons(req, res, 'pages/message/inbox', {messages})
            },
            fail: (reason) => htmlResponse.fail(req, res, reason)
        })
    })
})

router.get('/sentMessages', auth.authorizeUser, (req, res) =>
{
    userModel.getUserInfo(req, (user, isAdmin) => 
    {
        messageModel.getMessagesByUser(user, 
        {
            success: (messages) => 
            {
                baseView.renderWithAddons(req, res, 'pages/message/sentMessages', {messages})
            },
            fail: (reason) => htmlResponse.fail(req, res, reason)
        })
    })
})

router.post('/send', auth.authorizeUser, (req, res) =>
{
    let message = req.body;
    userModel.getUserInfo(req, (user, isAdmin) =>
    {
        if (req.body.usernameTo == 'Admin')
        {
            adminModel.getAdminWithLowestMessage(
            {
                success: (adminUserID) => 
                {
                    message.userIDFrom = user.id;
                    message.userIDTo = adminUserID;
                    messageModel.createMessage(message, 
                    {
                        success: () => res.send(jsonResponse.success()),
                        fail: (reason) => res.send(jsonResponse.fail(reason)) 
                    })
                },
                notFound: () => res.send(jsonResponse.fail("Could not find an admin to send the message to"))
            })
        }
        else 
        {
            userModel.getUser(req.body.usernameTo, 
            {
                found: (recipent) =>
                {
                    message.userIDFrom = user.id;
                    message.userIDTo = recipent.id;
                    messageModel.createMessage(message, 
                    {
                        success: () => res.send(jsonResponse.success()),
                        fail: (reason) => res.send(jsonResponse.fail(reason)) 
                    })
                },
                notFound: () => res.send(jsonResponse.fail("Could not find recipient username!"))
            })
        }
    })
})

router.get('/contact', auth.authorizeUser, (req, res) =>
{
    baseView.renderWithAddons(req, res, 'pages/message/contact');
})

module.exports = {router};