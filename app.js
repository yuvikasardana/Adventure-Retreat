//in this file we are running all our crud funxtionality and 
//making pages thorugh app.get
// the main place where everything connects to we run this to run our app
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

//console.log(process.env.SECRET)
//process.env.NODE_ENV: is an enviornment variable and is usually == development or production
//if we are running in development mode it will require the content of our dotenv file
//add the contents to process.env
//now we can upload this code without the env file and the user can fill in the variable on their own
// or in production mode it will be prefilled 
const express = require('express')
const mongoose = require('mongoose')// for database connection
const methodOverride = require('method-override')//for making post behave as put patch delete etc
const ejsMate = require('ejs-mate')//for integrating the boiler plate code
//const {campgroundSchema, reviewSchema} = require('./schemas.js')//the joi schema for validations //is broken down in diff routes now
//we are  destructuring here to require the multiple schemas from the same file
const ExpressError = require('./utilities/ExpressError')
const Joi = require('joi')//to make joi schema valudations
const reviewRoutes = require('./routes/reviews')
const campgroundRoutes= require('./routes/campground')
const userRoutes = require('./routes/users')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStratergy = require('passport-local')
const User = require('./models/user')
const mongoSanitize=require('express-mongo-sanitize')
const helmet =require('helmet');//for security issues
//changing or manipulating the behaviour of headers for security
//const dbUrl=process.env.DB_URL
const MongoStore= require('connect-mongo');
const dbUrl="mongodb://localhost:27017/yelp-camp";


mongoose.connect(dbUrl,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true ,

})

const db = mongoose.connection
db.on("error", console.error.bind(console, 'connection error'))//database connection
db.once("open", ()=>{
    console.log("Database connected")
})

const app = express()
const path = require('path')

app.engine('ejs', ejsMate)
app.set('view engine' , 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
// our req.body is by default empty the aove step is to patrse that body for us
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize())//to prevent mongo injection

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error", function(e){
    console.log("session store error",e)
})

const sessionConfig={
    store,
    name:'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      //  secure:true,
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
          // to make the cookie expire a week from now
        maxAge:1000*60*60*24*7
    }
}
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(session(sessionConfig))
app.use(flash())
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dsg9cf16u/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(passport.initialize())
app.use(passport.session())
passport.use( new LocalStratergy (User.authenticate()))
//use the localstratergy and to authenticate the local stratergy we have an authentication model located on USer 

passport.serializeUser(User.serializeUser())
// telling passport how to srialize a user oe how to store user info in the session
passport.deserializeUser(User.deserializeUser())
// how to get a user out of that session




app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    // to export current user globally
    next();
})



app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)


app.get('/', (req,res)=>{
   // res.send('HELLO FROM YELP CAMP')
    res.render('home')

})

app.get('/fakeUser', async(req,res)=>{
    const user = new User({email: 'yuvika@gmail.com', username: 'yuvikaa'})
 const newUser =  await User.register(user, 'chicken')
   //this takes the password hashes and salts it stores it registers new useretc
res.send(newUser)
})

















app.all('*',(req, res, next)=>{
   // next means it will also hit neeche wala error handler 
    next( new ExpressError('PAGE NOT FOUND', 404))
})// all: for every single reqiest/ *: for every single path run this if nothing else is matched

app.use((err, req, res, next)=>{
    const { statusCode = 500} = err;// here we extract statusCOde from the err object and give it a value of 404 if iit already doesnt have a value
    if(!err.message){
        err.message = 'Oh no Something Went wrong' 
    }
    //on the other hand for the message we are checking to see if the object does have a message and if it doesnt than hum object ke message ko hi ye string assign krre
    //this is because neeche we pass th whole object to error.ejs so it can use the message in the template as err.message wheeras status code is send separately thru res.send
    // we can still destructure message along with status code and then we can pass only the message separately in res.render and access it thru message
    res.status(statusCode).render('error' , {err})
})



app.listen(3000,()=>{
    console.log("Listening on port 3000")
}
)



// POST /campgrounds/:id/reviews
//this route for submitting the reviews so that they stay connected to their campgrounds



///register : get rquest to show use the form
// /register : POST request to actually creat a user
//logout route
//mongo password:n9PDyS6SOSApNySf