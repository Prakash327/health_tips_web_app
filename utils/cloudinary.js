const {v2 : cloudinary} =require ('cloudinary')
const fs = require('fs')
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret,
})

const uploadOnCloudinary= async (localFilePath)=>{
try {
    if(!localFilePath){
        throw new Error("no file path")
    } 
    //upload the file in cloudinary
   const response= await cloudinary.uploader.upload(localFilePath,{
        resource_type:'auto'
    })
    console.log("file has uploaded successfully",response.url)
    return response;
} catch (error) {
    fs.unlinkSync(localFilePath)
}
}
module.exports = {uploadOnCloudinary};