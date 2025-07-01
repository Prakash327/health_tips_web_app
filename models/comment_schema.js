const mongoose = require('mongoose');
const healthTips = require('./health_tips');
const health_tips_comment_Schema =  new mongoose.Schema({
   content:{
        type:String,
        required: [true, "Content is required"],
        minlength: [2, "Content must be at least 2 characters"],
        maxlength: [1000, "Content must be at most 1000 characters"],
        
    },
    firebaseUid:{
        type: String,
        required: true,
        // unique: true,
        index: true
    },
    
    healthTips:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'health_tips',
        required:true
    },
},{
timestamps: true
    
})
const health_tips_likeSchema = new mongoose.Schema({
healthTips:{
    type:mongoose.Schema.Types.ObjectId,
     ref:'health_tips',
     required :true
},
firebaseUid:{
     type: String,
        required: true,
        // unique: true,
        index: true
    },
    createdAt :{
        type: Date, 
        default:Date.now
    },
},{
        indexes: [[{ firebaseUid: 1,healthTips : 1 }, { unique: true }]]
})

const health_tips_share_Schema= new mongoose.Schema({
    firebaseUid:{ type: String,
        required: true,
        // unique: true,
        index: true
    },
    healthTips:{ type:mongoose.Schema.Types.ObjectId,
     ref:'health_tips',
     required :true},
    createdAt:{type:Date, default:Date.now}
    },{
        indexs:[[{firebaseUid:1, healthTips:1},{unique:true}]]
})


const Comment = mongoose.model('Comment',health_tips_comment_Schema)
const Like = mongoose.model('Like',health_tips_likeSchema)
const Share = mongoose.model('Share',health_tips_share_Schema)


module.exports = {Comment,Like,Share};


