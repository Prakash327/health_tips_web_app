const admin = require ('firebase-admin')
const dotenv = require('dotenv')
dotenv.config()


///--->>Initialize firebase Admin SDK
const serviceAccount = require("../service_account/health-tips-web-app-firebase-adminsdk-fbsvc-fc23221781.json")

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
})

module.exports= admin;