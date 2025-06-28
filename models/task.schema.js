const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregate = require('mongoose-aggregate-paginate-v2');
// title, description, status, priority, dueDate, assignedTo, createdBy, project
// status: pending, completed, in_progress
// priority: low, medium, high
// dueDate: date
// assignedTo: user id
// createdBy: user id
// project: project id

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed", "cancelled"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    dueDate: {
        type: Date,
        required: true
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

taskSchema.plugin(mongoosePaginate);
taskSchema.plugin(mongooseAggregate);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
