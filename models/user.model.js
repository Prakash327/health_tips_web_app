const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password:{
        type:String,
        required:true,
        min:[5,"password musst be not less than 5"]
    }


})

const User = mongoose.model('User',userSchema)
module.exports = User;

