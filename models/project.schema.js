const mongoose = require("mongoose")

// name, description, createdBy, members, status
// status: active, completed, archived
// createdBy: user id
// members: array of user ids

const projectSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],

    status: {
        type:String,
        enum:["active", "completed", "archived"],
        default:"active"
    }
})


const Project = mongoose.model("Project", projectSchema)

module.exports = Project
