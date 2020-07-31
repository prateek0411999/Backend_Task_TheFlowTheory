const mongoose= require('mongoose');
const Schema = mongoose.Schema
const login = new Schema({
    fullname: String,
    email: String,
    password: String
    
})

module.exports=mongoose.model('login',login,'flow');