const Review = require('../models/review')
const Campground = require('../models/campground')// requiring the model / schema for our campground

module.exports.createReview= async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    
    campground.reviews.push(review)
    await review.save()
     await campground.save()
     req.flash('success', ' Successfully posted your review')
     res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview =async(req,res)=>{
    const { id, reviewId}= req.params;
     await Campground.findByIdAndUpdate(id, { $pull:{reviews: reviewId}})
     //find the campground by id and then 
     await Review.findByIdAndDelete(req.params.reviewId)
     req.flash('success', ' Sucessfully deleted review')
     res.redirect(`/campgrounds/${id}`)
 
 }