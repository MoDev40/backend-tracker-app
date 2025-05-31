const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
        
    },
    password: String,
    role: {
        type:String,
        enum:["user", "admin"],
        default:"user"
    }
})


const User = mongoose.model("User", userSchema);

module.exports = User;