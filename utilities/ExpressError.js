class ExpressError extends Error {
    constructor(message, statusCode){
       super();
       this.message = message
       this.statusCode = statusCode
       //can also provide a default value
    }
}
module.exports = ExpressError;
