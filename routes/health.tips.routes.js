const express = require('express')
const router = express.Router()
const{createHealthTips,updateHealthTips,deleteHealthTips,getHealthTips,getHealthTipsById,getAllHealthTips}= require("../controllers/health.tips.controller.js")
const {upload} = require('../middleware/file.upload.js')
const authMiddleware= require('../middleware/authMiddleware.js')
router.route('/').post(authMiddleware,upload.single('photo'),createHealthTips)
router.route('/:id').put(authMiddleware,upload.single('photo'),updateHealthTips)
router.route('/:id').delete(authMiddleware,deleteHealthTips)
router.route('/').get(authMiddleware,getHealthTips)
router.route('/:id').get(authMiddleware,getHealthTipsById)
router.route('/all').get(authMiddleware,getAllHealthTips)

module.exports = router;