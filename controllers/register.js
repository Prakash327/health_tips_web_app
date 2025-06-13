const admin = require("../config/firebase.js")
const User = require("../models/user.model.js");
const bcrypt = require("bcrypt")


async function registerUser (request,response){
    const {email,password}= request.body;
    if(!email|| !password){
        return response.status(404).json({status:false,message:"please provide the fields correctly"})
    }
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password
        })
        console.log(userRecord)
        response.status(201).json({message:"usercreated",userId:userRecord.uid})
    } catch (error) {
        console.error("Register error:", error);
        response.status(400).json({ message: 'Server error' });
    }
}
async function loginUser(request,response) {
    try {
        const { uid,email } = request.user|| {}
        if (!uid || !email) {
            return response.status(401).json({ message: "Unauthorized or missing token" });
        }
        

       response.status(200).json({message:"loged in",user:{uid,email}})
    } catch (error) {
        console.error('Login error:', error);
        response.status(500).json({ message: 'Server error' });
    }
}
async function getUser(request,response) {
    const {uid}= request.user;
    try {
        const userRecord = await admin.auth().getUser(uid)
        response.status(200).json({user:userRecord})
    } catch (error) {
     console.error('get user error:', error);
        response.status(500).json({ message: 'Server error' });   
    }
    
}
module.exports={registerUser,loginUser,getUser}
