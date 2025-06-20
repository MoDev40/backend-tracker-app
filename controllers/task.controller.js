const Task = require("../models/task.schema");

const createTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo, priority, dueDate } = req.body;
        const createdBy = req.user?._id;

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            createdBy,
            priority,
            dueDate
        });

        if (!task) {
            return res.status(400).json({ message: "Failed to create task" });
        }

        const populatedTask = await Task.findById(task._id)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name");

        res.status(201).json({ message: "Task created successfully", data: populatedTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, assignedTo, status, priority, dueDate } = req.body;
        const { id } = req.params;

        const updateData = {
            title,
            description,
            assignedTo,
            status,
            priority,
            dueDate
        };

        // If status is being updated to completed, set completedAt
        if (status === "completed") {
            updateData.completedAt = new Date();
        } else if (status !== "completed") {
            updateData.completedAt = null;
        }

        const task = await Task.findByIdAndUpdate(id, updateData, { new: true })
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", data: task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const assignTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        if (!assignedTo) {
            return res.status(400).json({ message: "assignedTo field is required" });
        }

        const task = await Task.findByIdAndUpdate(
            id, 
            { assignedTo }, 
            { new: true }
        )
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ 
            message: "Task assigned successfully", 
            data: task 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const assignMultipleTasks = async (req, res) => {
    try {
        const { taskIds, assignedTo } = req.body;

        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({ message: "taskIds array is required" });
        }

        if (!assignedTo) {
            return res.status(400).json({ message: "assignedTo field is required" });
        }

        const updatedTasks = await Task.updateMany(
            { _id: { $in: taskIds } },
            { assignedTo },
            { new: true }
        );

        const tasks = await Task.find({ _id: { $in: taskIds } })
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name");

        res.status(200).json({ 
            message: `${tasks.length} tasks assigned successfully`, 
            data: tasks 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTasks = async (req, res) => {
    try {
        const { project, status, assignedTo } = req.query;
        const filter = {};

        if (project) filter.project = project;
        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;

        const tasks = await Task.find(filter)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Tasks fetched successfully", data: tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task fetched successfully", data: task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await Task.find({ project: projectId })
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Project tasks fetched successfully", data: tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTasksByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.query;
        
        const filter = { assignedTo: userId };
        if (status) filter.status = status;

        const tasks = await Task.find(filter)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            message: "User tasks fetched successfully", 
            data: tasks 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    createTask,
    updateTask,
    assignTask,
    assignMultipleTasks,
    getTasks,
    getTaskById,
    deleteTask,
    getTasksByProject,
    getTasksByUser
}; 