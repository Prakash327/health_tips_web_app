const express = require('express')
const router = express.Router()
const authMiddleware= require('../middleware/authMiddleware.js')
const commentController = require("../controllers/Comment.controller.js")

router.route('/:HealthTips_id').get(authMiddleware,commentController.getCommentsByHtipsId)
router.route('/:HealthTips_id').post(authMiddleware,commentController.createComment)
router.route('/:commentId').put(authMiddleware,commentController.updateComment)
router.route('/:commentId').delete(authMiddleware,commentController.deleteComment)


module.exports =router;