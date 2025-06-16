const admin = require("../config/firebase.js")
const axios = require('axios');
require('dotenv').config()

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


async function registerUser(request,response) {
    const{email, password} = request.body;
     if(!email|| !password){
        return response.status(404).json(
            {
                status:false,
                message:"please provide the fields correctly"

            })
    }
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password
        })
        // const customToken = await admin.auth().createCustomToken(userRecord.uid)
        response.status(201).json({
            message:"user created successfully",
            userId:userRecord.uid,
            
        })
    } catch (error) {
        console.error('Login error:', error);
        response.status(500).json({ message: error.message||'Server error' });
    }
}

async function loginUser(request, response) {
  try {
    const { email, password } = request.body;
    const API_KEY = process.env.api_key111; // <-- Replace with your Firebase project's Web API Key 
    async function getFirebaseToken1() {
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
          {
            email,
            password,
            returnSecureToken: true,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return response.data.idToken; // Return the ID token
      } catch (error) {
        console.error('Error getting token:', error.response?.data || error.message);
        throw new Error('Invalid email or password'); 
      }
    }

    
    const idToken = await getFirebaseToken1();

    // Optionally, verify the ID token and get user details (if needed)
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await admin.auth().getUser(decodedToken.uid);

    response.status(200).json({
      message: "Logged in successfully",
      user: {
        uid: user.uid,
        email: user.email,
      },
      token: idToken, 
    });
     
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).json({
      message: error.message || "Server error",
    });
  }
}
module.exports={registerUser,loginUser,getUser}