module.exports = func =>{
    return (req,res,next)=>{
        func(req,res,next).catch(next)
    }
}
//a function that accepts a function and returns a function
// that takes the passed func catches it and passes it to next 
//so that next error handeling stuff can be executed