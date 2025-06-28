const mongoose = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregate = require('mongoose-aggregate-paginate-v2');
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

projectSchema.plugin(mongoosePaginate);
projectSchema.plugin(mongooseAggregate);

const Project = mongoose.model("Project", projectSchema)

module.exports = Project
