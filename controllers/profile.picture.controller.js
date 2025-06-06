const {uploadOnCloudinary}= require('../utils/cloudinary.js')
async function uploadProfilePicture(request,response){
    try {
        // const file = request.file ? request.file.buffer : null 
        // const profilePicture = await photo.create({photo:file})
        const file = request.file;
        const result = await uploadOnCloudinary(file.path)
        return response.status(200).json(
            {message:"profile picture updated successfully",
                 message: "Profile picture uploaded successfully",
                url: result.secure_url
            }
        )
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports={uploadProfilePicture}