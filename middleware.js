const { campgroundSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utilities/ExpressError.js')
const Campground= require('./models/campground')
const Review = require('./models/review')
module.exports.isLoggedIn = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in')
       return res.redirect('/login')
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        //due to recent developments in passport the session gets cleared after a succesful login
        //this middleware is to save the returnTO value from the session to the res.locals
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body)
    if(error){
     const msg = error.details.map(el => el.message).join(',')//map returs a new array that we join through a comma into a new string
     throw new ExpressError(msg, 404)
    }else{
     next()
    }
    
 }

  module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
 }

 module.exports.validateReview = (req,res,next)=>{
    const { error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')//map returs a new array that we join through a comma into a new string
        throw new ExpressError(msg, 404)
       }else{
        next()
       }
}

module.exports.isReviewAuthor =async (req,res,next)=>{
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
 