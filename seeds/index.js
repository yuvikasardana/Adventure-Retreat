// here we have use the descriptors and cities names to 
// create random campground names (location and title)
// we then save them using new Campground option
//now we have 50 objects with a class of Campground  wit hrandomly genrated location and title


//const express = require('express')
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true ,
    //useCreateIndex: true
})

const db = mongoose.connection
db.on("error", console.error.bind(console, 'connection error'))
db.once("open", ()=>{
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random()*array.length)];


const seedDB = async () =>{
    await Campground.deleteMany({})
        for(let i=0; i<300; i++){
            const random1000 = Math.floor(Math.random()*1000);
            const price = Math.floor(Math.random()*20)+10
            const camp = new Campground ({
                author: '64c2c54e0d4761fdf67bf273',
                location: `${cities[random1000].city} ,${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
               // image: 'https://source.unsplash.com/collection/483251',
               images: [
                
                    {
                      url: 'https://res.cloudinary.com/dsg9cf16u/image/upload/v1692512833/YelpCamp/flm6muf9r3gvalvtgjtf.png',
                      filename: 'YelpCamp/flm6muf9r3gvalvtgjtf'
                
                    }
                  
                
               ],
                description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt repellat ducimus magnam? Nam voluptates aspernatur dolores? Maxime, maiores excepturi sapiente rem suscipit, voluptates pariatur, praesentium dolorem eos odit officia aspernatur.',
                price,
                geometry: {
                    type: "Point",
                    coordinates:[cities[random1000].longitude,
                cities[random1000].latitude]
                }
            })
            await camp.save();
        }
}
seedDB().then(//closes the db connection since our work is done
    ()=>{
        mongoose.connection.close()
    }
);

