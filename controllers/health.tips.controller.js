const healthTips = require("../models/health_tips");
const fs = require('fs').promises
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { default: mongoose } = require("mongoose");
async function createHealthTips(request, response) {
  try {
    const { title, content } = request.body;
    const firebaseUid = request.user?.uid;
    if (!title || !content) {
      return response.status(400).json({ message: "all fields are mandatory" });
    }
    // const existingHealthTips = await healthTips.findOne({ title });
    // if (existingHealthTips) {
    //   return response
    //     .status(400)
    //     .json({ message: "health_tips_already_exits" });
    // }

    let image = "";
    if (request.file) {
      const result = await uploadOnCloudinary(request.file.path);
      image = result.secure_url;
    }
    const healthtips = new healthTips({
      firebaseUid,
      title,
      content,
      image,
    });
    await healthtips.save();
    return response.status(200).json({
      message: "health tips created successfully",
      healthtips: {
        id: firebaseUid,
        mongooseId: healthtips._id,
        title,
        content,
        image: healthtips.image,
      },
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
async function updateHealthTips(request, response) {
  try {
    if (!request.user?.uid) {
      return response.status(401).json({
        status: "error",
        message: "Unauthorized: No user found",
      });
    }
    const { id } = request.params;
    const firebaseUid = request.user.uid;
    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({
        status: "error",
        message: "Invalid profile ID",
      });
    }
    const healthtips = await healthTips.findOne({ _id: id, firebaseUid });
    if (!healthtips) {
      return response.status(404).json({
        status: "error",
        message: "Health tips not found",
      });
    }
    const { title, content } = request.body || {};
    //-->check if any valid field or file is provided
    const updates = { title, content };
    const hasUpdates = Object.values(updates).some(
      (value) => value !== undefined
    );
    if (!hasUpdates && !request.file) {
      return response.status(400).json({
        status: "error",
        message: "At least one field (title content, or photo) is required",
      });
    }
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        healthtips[key] = updates[key];
      }
    });
    if (request.file) {
      try {
        const result = await uploadOnCloudinary(request.file.path);
        if (!result?.secure_url) {
          throw new Error("Cloudinary upload failed");
        }
        healthtips.image = result.secure_url;
        await fs
          .unlink(request.file.path)
          .catch((err) => console.error("Failed to delete local file:", err));
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return response.status(500).json({
          status: "error",
          message: "Failed to upload photo",
        });
      }
    }
    await healthtips.save();
    console.log("photo after save:", healthtips.image);
    return response.status(200).json({
      status: "success",
      message: "health updated successfully",
      data: {
        id: healthtips._id,
        title: healthtips.title,
        content: healthtips.content,
        image: healthtips.image,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}
async function deleteHealthTips(request,response){
    try{
    const {id}= request.params;
    const firebaseUid = request.user?.uid;
    if(!mongoose.isValidObjectId(id)){
        return response
        .status(400)
        .json({
            status:"error",
            message:"invalid healthTips ID"
        })
    }
    const healthtips = await healthTips.findOneAndDelete({_id:id,firebaseUid})
    if(!healthtips){
        return response
        .status(404)
        .json({message:"Health tips not found "})
    }
    response.status(200).json({
        message:"health tips deleated sucessfully"
    })
}catch(error){
    return response.status(500).json({error:error.message})
}
}
async function getHealthTips(request,response){
    try {
        const firebaseUid = request.user?.uid;
        if(!firebaseUid){
            return response.status(401).json({
                status:"error",
                message:"unauthorized : no user found"
            })
        }
        const result = await healthTips.find({firebaseUid})
        return response.status(200).json({
            status:"success",
            message:"health tips got successfully",
            data:result
        })
    } catch (error) {
        return response.status(500).json({error:error.message})
    }
}
async function getHealthTipsById(request,response){
    try {
        const {id} = request.params;
        const firebaseUid = request.user?.uid;
        if(!firebaseUid){
            return response.status(401).json({
                status:"error",
                message:"unauthorized : no user found"
            })
        }
        const result = await healthTips.findOne({_id:id,firebaseUid})
        return response.status(200).json({
            status:"success",
            message:"health tips got successfully",
            data:result
        })
    } catch (error) {
        return response.status(500).json({error:error.message})
    }
}
async function getAllHealthTips(request,response){
    try {
        
        const firebaseUid = request.user?.uid;
        if(!firebaseUid){
            return response.status(401).json({
                status:"error",
                message:"unauthorized : no user found"
            })
        }
        const result = await healthTips.find({})
        return response.status(200).json({
            status:"success",
            message:"all health tips got successfully",
            data:result
        })
    } catch (error) {
        return response.status(500).json({error:error.message})
    }
}
module.exports = { createHealthTips,updateHealthTips,deleteHealthTips,getHealthTips,getHealthTipsById,getAllHealthTips };
