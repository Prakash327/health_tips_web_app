const express= require('express')
const router = express.Router()
const authMiddleware= require("../middleware/authMiddleware.js")
const {upload} = require("../middleware/file.upload.js")
const{getProfile,createProfile,updateProfile,deleteProfile}=require('../controllers/profile.controller.js')

router.route('/').get(authMiddleware,getProfile)
router.route('/').post(authMiddleware,upload.single('photo'),createProfile)
router.route('/:id').put(authMiddleware,upload.single('photo'),updateProfile)
router.route('/:id').delete( authMiddleware, deleteProfile);

module.exports= router;