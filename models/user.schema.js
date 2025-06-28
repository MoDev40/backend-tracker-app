const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregate = require('mongoose-aggregate-paginate-v2');

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
    password: {
        type:String,
        required:true
    },
    role: {
        type:String,
        enum:["user", "admin"],
        default:"user"
    }
})

userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregate);

const User = mongoose.model("User", userSchema);

module.exports = User;