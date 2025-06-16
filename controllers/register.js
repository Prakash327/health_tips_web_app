const admin = require("../config/firebase.js")

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
    const { idToken } = request.body;

    if (!idToken) {
      return response.status(400).json({ message: "ID token is required" });
    }
    

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userRecord = await admin.auth().getUser(uid);

    response.status(200).json({
      message: "Logged in successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
      },
      token: idToken, // Optional: return the ID token
    });
     
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).json({
      message: error.message || "Server error",
    });
  }
}
module.exports={registerUser,loginUser,getUser}