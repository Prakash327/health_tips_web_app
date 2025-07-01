const {Like} = require('../models/comment_schema.js')
const HealthTips = require("../models/health_tips.js");
const mongoose = require('mongoose')

exports.create_Like=async(req,res)=>{
//     try {
//         const { healthTipId } = req.params;
//     const { uid } = req.user;

//     console.log('Processing like for healthTipId:', healthTipId, 'by user:', uid); // Debug

//     // Validate healthTipId
//     if (!mongoose.Types.ObjectId.isValid(healthTipId)) {
//       return res.status(400).json({ message: 'Invalid health tip ID' });
//     }

//     // Check if health tip exists
//     const healthTip = await HealthTips.findById(healthTipId);
//     if (!healthTip) return res.status(404).json({ message: 'Health tip not found' });

//     // Check if user already liked the health tip
//     const existingLike = await Like.findOne({ firebaseUid: uid, healthTips: healthTipId });
//     console.log('Existing like:', existingLike); // Debug

//     if (existingLike) {
//       // Unlike: Remove Like document and pull from health_tips.likes
//       await Like.deleteOne({ firebaseUid: uid, healthTips: healthTipId });
//       await HealthTips.findByIdAndUpdate(healthTipId, {
//         $pull: { likes: existingLike._id },
//       });
//       console.log('Like removed from Like collection and health_tips'); // Debug
//       return res.json({ message: 'Health tip unliked', liked: false });
//     } else {
//       // Like: Create new Like document and push to health_tips.likes
//       const newLike = new Like({ firebaseUid: uid, healthTips: healthTipId });
//       console.log('Attempting to save like:', newLike); // Debug
//       await newLike.save();
//       console.log('Like saved to Like collection'); // Debug

//       // Update health_tips.likes array
//       await HealthTips.findByIdAndUpdate(healthTipId, {
//         $push: { likes: newLike._id },
//       });
//       console.log('Like added to health_tips.likes'); // Debug

//       return res.json({ message: 'Health tip liked', liked: true });
//     }
// }catch (error) {
//         console.log(error)
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
const { healthTipId } = req.params;
    const { uid } = req.user;

    console.log('Processing like for healthTipId:', healthTipId, 'by user:', uid); // Debug

    if (!mongoose.Types.ObjectId.isValid(healthTipId)) {
      return res.status(400).json({ message: 'Invalid health tip ID' });
    }

    const healthTip = await HealthTips.findById(healthTipId);
    if (!healthTip) return res.status(404).json({ message: 'Health tip not found' });

    const existingLike = await Like.findOne({ firebaseUid: uid, healthTips: healthTipId });
    console.log('Existing like:', existingLike); // Debug

    if (existingLike) {
      await Like.deleteOne({ firebaseUid: uid, healthTips: healthTipId });
      await HealthTips.findByIdAndUpdate(healthTipId, {
        $pull: { likes: existingLike._id },
      });
      console.log('Like removed from Like collection and health_tips'); // Debug
      return res.json({ message: 'Health tip unliked', liked: false });
    } else {
      const newLike = new Like({ firebaseUid: uid, healthTips: healthTipId });
      console.log('Attempting to save like:', newLike); // Debug
      await newLike.save();
      console.log('Like saved to Like collection'); // Debug

      await HealthTips.findByIdAndUpdate(healthTipId, {
        $push: { likes: newLike._id },
      });
      console.log('Like added to health_tips.likes'); // Debug
      return res.json({ message: 'Health tip liked', liked: true });
    }
   
}

exports.getLikeCount = async(req,res)=>{
    try {
        const {healthTipId} = req.params;
        const  firebaseUid = req.user?.uid;
        //  const firebaseUid = req.user?.uid;
        console.log(healthTipId)
        console.log(firebaseUid)
        if(!mongoose.Types.ObjectId.isValid(healthTipId)){
            return res.status(400).json({message:"Invalid Health tip Id"})
        }
        const healthTip = await HealthTips.findById(healthTipId)
        if(!healthTip){
            return res.status(404).json({message:"health tip not found"})
        }
        const likeCount = healthTip.likes.length;
        const userLiked = await Like.exists({firebaseUid: firebaseUid, healthTips: healthTipId})
        console.log(userLiked)
        res.json({likeCount,liked:userLiked})
    } catch (error) {
    console.error('Error in get like status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
    }
}