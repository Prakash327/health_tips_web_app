const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
    firebaseUid:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name:{
        type:String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name must be at most 50 characters"],
        trim: true

    },
    age:{
        type: Number,
        required: [true, "Age is required"],
        min: [0, "Age must be a positive number"],
        max: [100, "Age must be less than or equal to 120"]
    },
    gender:{
        type: String,
        required: [true, "Gender is required"],
        enum: ["male", "female", "other"]
    },
    bio:{
        type: String,
        maxlength: [500, "Bio must be at most 500 characters"],
        default: ""
    },
    photoUrl:{
        type:String,
        default:""
    }
})
const Profile = mongoose.model('Pofile',profileSchema);

module.exports = Profile;