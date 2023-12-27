const cloudinary = require('cloudinary').v2
const { CloudinaryStorage} = require("multer-storage-cloudinary")
// we pass in cloudinary to the cludinary storage

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET


});
//this is how we initialzed our cloudinary

const storage = new CloudinaryStorage({
cloudinary,
params:{
folder: "YelpCamp",
alllowedFormats:['jpeg','png', 'jpg']
}

})
//setting up an instance of cloudinary storage in this file

module.exports=
{cloudinary, storage}