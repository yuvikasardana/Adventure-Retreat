// here we have made our model and schema 


const mongoose = require('mongoose')
const Schema = mongoose.Schema;//to shorten mongoose.schema since we have to refrence it quiet often
const Review = require('./review')
const ImageSchema = new Schema({
    url:String,
    filename: String

});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})//every time u call img.thumbnaill this will perform this function on the image and give you a smaller image
//it looks as if we are storing this on the database but this actually only acts as a virtual property
const opts= {  toJSON:{ virtuals:true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: String,
    description: String,
    geometry:{
        type:{
            type:String,
            enum:['Point'], //geometry.type must be point
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    location:String,
    reviews: [// to connect a review with its campground
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'

        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'
    }
},opts) 
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}</p>`
})
CampgroundSchema.post('findOneAndDelete', async function(doc)/*passing whats deleted to our middleware function*/{
    if(doc){
await Review.deleteMany({
   _id: {
            $in : doc.reviews
    }
})
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema)
//make a model called campground for our different campgrounds
