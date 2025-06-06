const express = require("express")
const router = express.Router()
const {registerUser,loginUser,getUser}= require("../controllers/register.js")
const authMiddleware= require('../middleware/authMiddleware.js')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/getuser').get(authMiddleware,getUser)

module.exports = router;