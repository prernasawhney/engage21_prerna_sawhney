const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { GetUsers,
    GetId,
    Register,
    Login,
    UpdateProfilePic,
    UpdateUserInfo,
    UpdatePassword} =require('../../controller/user.js');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');

//Get Security key for token generating in .env file
require('dotenv').config();
const SECURITY_KEY = process.env.SECURITY_KEY;

//generate token for user
const generateToken = () => {
    const randomToken = require('random-token').create(SECURITY_KEY);
    return randomToken(50);
}

//get all users info(require security key)
router.get('/', GetUsers)
//get a user info(require security key)
router.get('/get/by/:id', GetId)

//register user
router.post('/register', Register)

//login user
router.post('/login',Login)


//Update profile picture
router.post('/profile_picture', UpdateProfilePic);

//Update user info
router.post('/update', jsonParser, UpdateUserInfo)

//update user password
router.post('/password/update',UpdatePassword)

module.exports = router;