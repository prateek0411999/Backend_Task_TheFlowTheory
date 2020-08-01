const mongoose= require('mongoose');
const Schema = mongoose.Schema
const uploader = new Schema({
    
    email: String,
    attachedimages: [{ 
    originalname: String,
    uploadname: String
}]
    
})

module.exports=mongoose.model('uploader',uploader,'uploader');