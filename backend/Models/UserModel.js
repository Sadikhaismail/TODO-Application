const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },              
  email: { type: String, required: true, unique: true },   
  password: { type: String, required: true },              
  confirmPassword: { type: String, required: true },       
  phoneNumber: { type: String, required: true },           
  address: { type: String, required: true },               
  age: { type: Number, required: true },                   
  gender: { type: String, required: true },                
  profession: { type: String, required: true },            
  profilePicture: { type: String, required: false },      
  createdAt: { type: Date, default: Date.now },           
});

module.exports = mongoose.model("User", userSchema);
