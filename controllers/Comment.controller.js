const {Comment} = require("../models/comment_schema");
const HealthTips = require("../models/health_tips");
const admin = require("../config/firebase.js");
const { default: mongoose } = require("mongoose");

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;

    const { HealthTips_id } = req.params;
    const firebaseUid = req.user?.uid;
    console.log(
      "content:",
      content,
      "\nhealthtips_id:",
      HealthTips_id,
      "\nfirebase_id:",
      firebaseUid
    );
    if (!req.user?.uid) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: No user found",
      });
    }
    //check if health tips is in database or not
    const healthTip = await HealthTips.findById(HealthTips_id);
    if (!healthTip) {
      return res.status(404).json({ error: " health tips not found" });
    }
    // create comment
    const comment = new Comment({
      content,
      firebaseUid,
      healthTips: HealthTips_id,
    });

    //save comment
    await comment.save();
    healthTip.comments.push(comment._id);
    await healthTip.save();

    const user = await admin.auth().getUser(firebaseUid);
    const commentResponse = {
      ...comment.toObject(),
      user: {
        firebaseUid: user.uid,
        displayName: user.displayName || user.email,
      },
    };

    res.status(201).json(commentResponse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getCommentsByHtipsId = async (req, res) => {
  try {
    const { HealthTips_id } = req.params;
    const health_tips = await HealthTips.findById(HealthTips_id);
    if (!health_tips) {
      return res.status(404).json({
        success: false,
        error: "Health tips not found",
      });
    }
    //fetch comments
    const comments = await Comment.find({ healthTips: HealthTips_id }).sort({
      createdAt: -1,
    });
    //fetch user details for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        try {
          const user = await admin.auth().getUser(comment.firebaseUid);
          return {
            ...comment.toObject(),
            user: {
              firebaseUid: user.uid,
              displayName: user.displayName || user.email,
            },
          };
        } catch {
          return {
            ...comment.toObject(),
            user: {
              firebaseUid: user.uid,
              displayName: "Unknown user",
            },
          };
        }
      })
    );
    res.status(200).json({
      success: true,
      data: commentsWithUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
};

exports.updateComment = async (request, response) => {
  try {
    const {commentId} = request.params;
    const firebaseUid = request.user?.uid;
    const content = request.body.content;
    if (!content) {
      return response.status(404).json({
        success: false,
        message: "Content is required",
      });
    }

    const comment = await Comment.findById(commentId.toString());
    console.log(comment)
    if (!comment) {
      return response.status(404).json({
        success: false,
        message: "COmment not Found",
      });
    }
    // Check if the authenticated user owns the comment
    if (comment.user !== request.user._id) {
      // Assuming req.user is set by auth middleware
      return response
        .status(401)
        .json({ message: "Not authorized to update this comment" });
    }
    // Update comment
    comment.content = content;
    const updatedComment = await comment.save();

    // Return updated comment
    response.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: "Server error.",
    });
  }
};
exports.deleteComment =async(req,res)=>{
  try {
  //   const {commentId} = request.params;
  //   const firebaseUid = request.user?.uid;
  //   if (!firebaseUid) {
  //     return response.status(401).json({ message: "Unauthorized: User not authenticated" });
  //   }
  //   if(!mongoose.isValidObjectId(commentId)){
  //     return response
  //     .status(400)
  //     .json({
  //       status:"error",
  //       message:"invalid comment ID"
  //     })
  //   }
    
  //   const commettoDelete = await Comment.findByIdAndDelete({_id:commentId,firebaseUid})
  //   await HealthTips.findByIdAndUpdate(
  //     commettoDelete.,
  //     {$pull :{comments:commentId}},
  //     {new:true}
  //   )
  //   if(!commettoDelete){
  //     return response
  //     .status(404)
  //     .json({message:"comment not found"})
  //   }
  //   response.status(200).json({
  //     message:"comment deleted successfully",
  //     commettoDelete
  //   })
 
  // } catch (error) {
  //   console.error(error);
  //   response.status(500).json({
  //     error: "Server error.",
  //   });
  // }

  // Extract commentId from request parameters
    const { commentId } = req.params;
    // Extract Firebase UID from authenticated user
    const firebaseUid = req.user?.uid;
    console.log(firebaseUid)
    // Check if user is authenticated
    if (!firebaseUid) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: User not authenticated',
      });
    }

    // Validate commentId is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid comment ID',
      });
    }

    // Find and delete the comment if it belongs to the authenticated user
    const commentToDelete = await Comment.findOneAndDelete({
      _id: commentId,
      firebaseUid,
    });

    // Check if comment was found and deleted
    if (!commentToDelete) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found or not authorized to delete',
      });
    }

    // Remove the comment reference from the associated HealthTips document
    await HealthTips.findByIdAndUpdate(
      commentToDelete.healthTips, // Assuming commentToDelete has a healthTipId field
      { $pull: { comments: commentId } },
      { new: true }
    );

    // Return success response
    return res.status(200).json({
      status: 'success',
      message: 'Comment deleted successfully',
      data: commentToDelete,
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error deleting comment:', error);

    // Return server error response
    return res.status(500).json({
      status: 'error',
      message: 'Server error. Please try again later.',
    });
  }
}