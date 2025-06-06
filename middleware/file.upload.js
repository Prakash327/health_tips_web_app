const fs = require('fs')
const path = require('path')
const multer = require('multer')
//--> creates uploads folder to upload photo if folder is not present
function ensureUploadDir() {
    const uploadDir = path.join(__dirname,'..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    return uploadDir;
}

const uploadDir = ensureUploadDir();
uploadDir;

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        
        cb(null,'uploads/');
    },
    filename:(req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname); 
    }
})

const upload = multer({storage: storage})
module.exports = {upload}

