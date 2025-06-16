const {upload} = require("../middleware/file.upload.js")
const authMiddleware= require('../middleware/authMiddleware.js')
const {uploadProfilePicture}= require("../controllers/profile.picture.controller.js")

const express = require('express')
const router = express.Router()

router.route("/").post(authMiddleware,upload.single('photo'),uploadProfilePicture)

module.exports = router;