const express = require('express')
const router = express.Router()
const{registerUser, findUser} = require('./../controllers/auth.js')
router.route('/').post(registerUser)
router.route('/get').get(findUser)

module.exports =router;