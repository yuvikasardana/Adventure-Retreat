const mongoose = require ('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique:true
    }
});
UserSchema.plugin(passportLocalMongoose)
//it adds a password(hash and salting included) and a username field

module.exports = mongoose.model('User', UserSchema)