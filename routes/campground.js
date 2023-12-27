const express = require('express')
const router = express.Router();
const catchAsync= require('../utilities/catchAsync')//the error method incaase there is an error in the async functions
const ExpressError = require('../utilities/ExpressError')
const Campground = require('../models/campground')// requiring the model / schema for our campground
const {campgroundSchema } = require('../schemas.js')//the joi schema for validations 
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
//const upload = multer({dest:'uploads/'}) storing things in the uploads folder locally
const {storage}= require('../cloudinary')
const upload = multer({storage});
//store using the storage made by using cloudinary

router.route('/')
.get(catchAsync(campgrounds.index ))
.post(isLoggedIn, upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground))
//.post(upload.array('image'),(req,res,next)=>{
    //res.send(req.body)
    //console.log(req.body , req.files)
//})

router.get('/new', isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
.get( catchAsync(campgrounds.showCampground))
.put(isLoggedIn,isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))
.delete( catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports= router;


/*1. to store images in a folder in cloudinary we made adjustments in the cloudinarystorage object

2. make the image parameter in the model to be an array and each element of the array to contain a url and a filename

3. upload.array the images in the post route

4. now we have access to the req.body/ req.files in the createCampground wali thingy in controlllers so we go there 

map over the images wala array to set har kisi ka url and filename from the request file*/