const User = require('../models/user')

module.exports.registerForm=(req,res)=>{
    res.render('users/register')
}

module.exports.createUser = async (req,res)=>{
    try{
       const {email, username, password} = req.body
       const user =  new User({email, username})
       const registeredUser = await User.register(user, password)
       req.login(registeredUser, err=>{
        if(err){
            return next(err);
        }
        req.flash('success','Welcome to yelpcamp')
       res.redirect('/campgrounds')
    })
       //takes the new user and then hashes the password and then stores it on the new user
     
    }catch(e){
    req.flash('error', e.message)
    res.redirect('register')
       }
      
    
    }

    module.exports.loginForm =(req,res)=>{
        res.render('users/login')
    }

    module.exports.loginUser =(req,res)=>{
    
        req.flash('success', 'welcome back')
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl)
     }

     module.exports.logoutUser = (req,res)=>{
        req.logout(function(err){
            if(err){
                return next(err)
            }
            req.flash('success', 'Goodbye!')
            res.redirect('/campgrounds')
        })
     }
