const Campground = require('../models/campground')// requiring the model / schema for our campground
const { cloudinary }=require('../cloudinary')
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken: mapBoxToken})//this contains the forward and reverse geocoder
module.exports.index=async (req, res)=>
{
    const campgrounds = await Campground.find({})
    
    res.render('campgrounds/index', {campgrounds})
}
module.exports.renderNewForm=(req,res)=>{
    //if(!req.isAuthenticated()){
       // req.flash('error', 'you must be signed in')
       //return res.redirect('/login')
   // }
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400 )
    // if body is empty then we throw the error here catchASync catches it sends it to our error handeler
    /// useful if someone sends data thru say postman instead of our form and leaves fields empty
    const geoData= await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry=geoData.body.features[0].geometry;
    campground.images = req.files.map(f=>({ url: f.path, filename: f.filename}))
   
    campground.author = req.user._id
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
    
 }

 module.exports.showCampground= async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
     path:'reviews',//popluates the reviews
     populate: {
         path:'author'//populates on each one of the reviews its own author
     }
  }).populate('author')//populate the author of the campground itself
    //console.log(campground)
    if(!campground){
     req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
    }
    
    //console.log(campground)
    res.render('campgrounds/show', {campground})
 }

 module.exports.renderEditForm =async (req,res)=>{
    const{ id } = req.params
    const campground = await Campground.findById(id)
    
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
       }

    res.render('campgrounds/edit', {campground});
}

module.exports.editCampground = async (req, res)=>{    
    const { id } = req.params;
   // await Campground.findById(id)
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs=req.files.map(f=>({ url: f.path, filename: f.filename}))
    campground.images.push(...imgs)//taking data form the array and passing it as separate arguments to the array
    //campground.images.push(req.files.map(f=>({ url: f.path, filename: f.filename})))
    //req.files.map makes us an entire array so we dont wanna push an entire array onto an existing array
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
    await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
    //pull those filenames wali images out from our main images array that have their filenames in the deleteImages array
    
}
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)

}
module.exports.deleteCampground = async (req,res)=>{
    const { id } = req.params;
   const campground= await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
   // const { id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}