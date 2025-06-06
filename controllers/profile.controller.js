const Profile = require("../models/profile.model.js");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs").promises;
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

async function createProfile(request, response) {
  try {
    const { name, age, gender, bio } = request.body;
    const firebaseUid = request.user?.uid;
    if (!firebaseUid || !name || !age || !gender || !bio) {
      return response.status(400).json({ message: "all fields are mandatory" });
    }
    const existingProfile = await Profile.findOne({ firebaseUid });
    if (existingProfile) {
      return response
        .status(400)
        .json({ message: "Profile already exists for this user" });
    }

    ///---->>>handel file upload
    let photoUrl = "";
    if (request.file) {
      const result = await uploadOnCloudinary(request.file.path);
      photoUrl = result.secure_url;
    }
    const profile = new Profile({
      firebaseUid,
      name,
      age,
      gender,
      bio,
      photoUrl,
    });
    await profile.save();
    return response
      .status(200)
      .json({
        message: "profile created",
        profile: {
          id: firebaseUid,
          name,
          age,
          gender,
          bio,
          photoUrl: profile.photoUrl,
        },
      });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
async function getProfile(request, response) {
  try {
    const profile = await Profile.find({});
    response.status(200).json({ message: "users get successfuly", profile });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
// async function updateProfile(request,response) {
//     try {
//        const { id } = request.params;
//       const { name, age, gender, bio } = request.body;
//       const firebaseUid = request.user?.uid;

//       // Find profile and ensure it belongs to the authenticated user
//       const profile = await Profile.findOne({ _id: id, firebaseUid });
//       if (!profile) {
//         return response.status(404).json({ message: 'Profile not found or not authorized' });
//       }

//       // const updates = { name, age, gender, bio };
//       // Object.keys(updates).forEach(key => {
//       //   if (updates[key] !== undefined) {
//       //     profile[key] = updates[key];
//       //   }
//       // });

//       // Update fields if provided
//         if (name !== undefined) profile.name = name;
//         if (age !== undefined) profile.age = age;
//         if (gender !== undefined) profile.gender = gender;
//         if (bio !== undefined) profile.bio = bio;

//         if(request.file){
//           const result = await uploadOnCloudinary(request.file.path)
//           photoUrl = result.secure_url;
//         }
//       // Save updated profile
//       await profile.save();

//       // Return updated profile
//       response.status(200).json({
//         message: 'Profile updated successfully',
//         profile: {
//           id: profile._id,
//           name: profile.name,
//           age: profile.age,
//           gender: profile.gender,
//           bio: profile.bio,
//           photoUrl: profile.photoUrl
//         }
//       });

//     } catch (error) {
//       return response.status(500).json({error:error.message})
//     }
// }

async function updateProfile(request, response) {
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

    const profile = await Profile.findOne({ _id: id, firebaseUid });
    if (!profile) {
      return response.status(404).json({
        status: "error",
        message: "Profile not found or not authorized",
      });
    }

    const { name, age, gender, bio } = request.body || {};

    //===/> Check if any valid field or file is provided
    const updates = { name, age, gender, bio };
    const hasUpdates = Object.values(updates).some(
      (value) => value !== undefined
    );
    if (!hasUpdates && !request.file) {
      return response.status(400).json({
        status: "error",
        message:
          "At least one field (name, age, gender, bio, or photo) is required",
      });
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        profile[key] = updates[key];
      }
    });

    if (request.file) {
      try {
        const result = await uploadOnCloudinary(request.file.path);
        if (!result?.secure_url) {
          throw new Error("Cloudinary upload failed");
        }
        profile.photoUrl = result.secure_url;
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

    await profile.save();
    console.log("Profile after save:", profile);

    return response.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        id: profile._id,
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        bio: profile.bio,
        photoUrl: profile.photoUrl,
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
async function deleteProfile(request, response) {
  try {
    const { id } = request.params;
    const firebaseUid = request.user?.uid;

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({
        status: "error",
        message: "Invalid Profile ID",
      });
    }

    // Find and delete the profile if it belongs to the authenticated user
    const profile = await Profile.findOneAndDelete({ _id: id, firebaseUid });
    if (!profile) {
      return response
        .status(404)
        .json({ message: "Profile not found or not authorized" });
    }

    response.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}

module.exports = { createProfile, getProfile, updateProfile, deleteProfile };
