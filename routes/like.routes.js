const express = require('express')
const router = express.Router()
const authMiddleware= require('../middleware/authMiddleware.js')
const likeController = require("../controllers/like.controller.js")
router.route("/:healthTipId").get(authMiddleware,likeController.getLikeCount)
router.route("/:healthTipId").post(authMiddleware,likeController.create_Like)

module.exports = router;