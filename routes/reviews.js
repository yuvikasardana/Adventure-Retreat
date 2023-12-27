const express = require('express')
const router = express.Router({mergeParams:true})
const Review = require('../models/review')
const catchAsync= require('../utilities/catchAsync')//the error method incaase there is an error in the async functions
const Campground = require('../models/campground')// requiring the model / schema for our campground
const ExpressError = require('../utilities/ExpressError')
const { reviewSchema} = require('../schemas.js')//the joi schema for validations 
const { validateReview, isLoggedIn, isReviewAuthor}= require('../middleware')
const reviews = require('../controllers/review')


router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router