const express = require('express');
const userProfile = require('../models/userProfile')
const userProfileView = require('../views/userProfileView');
const router = express.Router();
const jsonResponse = require('../utils/JSONResponse');
