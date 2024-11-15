import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  profilePic: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profileSetup:{
    type:Boolean,
    default:false
  }
});

const User = mongoose.model("Users",UserSchema)
export default User