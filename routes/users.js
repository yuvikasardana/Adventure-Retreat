const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user')
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users')

router.route('/register')
.get(users.registerForm)
.post( catchAsync(users.createUser))

router.route('/login')
.get(users.loginForm)
.post(
 // use the storeReturnTo middleware to save the returnTo value from session to res.locals
 storeReturnTo, 
 // passport.authenticate logs the user in and clears req.session
 passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),
 // Now we can use res.locals.returnTo to redirect the user after login
 users.loginUser)

 router.get('/logout',users.logoutUser)

module.exports = router