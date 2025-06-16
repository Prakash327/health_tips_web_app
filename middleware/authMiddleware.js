const admin = require ('../config/firebase.js')

const authMiddleware = async(request,response,next)=>{

    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return response.status(401).json({message:"Unauthorized"})
    }
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        request.user = {
            uid:decodedToken.uid,
            email:decodedToken.email
        };
        next()
    }catch(error){
        return response.status(401).json({message:"Invalid Token"})
    }
}

module.exports = authMiddleware;