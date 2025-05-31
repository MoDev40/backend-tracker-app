const { Schema, model, Types } = require("mongoose");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignee: {
      type: [],
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    ownedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);

module.exports = Task;
