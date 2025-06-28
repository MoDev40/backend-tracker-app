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

// Updated function with aggregate pipeline for table functionality
const getTasks = async (req, res) => {
    try {
        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const searchFields = req.query.searchFields ? req.query.searchFields.split(',') : ['title', 'description', 'status', 'priority'];
        
        // Filters
        const projectFilter = req.query.project;
        const statusFilter = req.query.status;
        const assignedToFilter = req.query.assignedTo;
        const priorityFilter = req.query.priority;
        const dueDateFrom = req.query.dueDateFrom;
        const dueDateTo = req.query.dueDateTo;
        
        // Parse sort parameter
        let sortObject = { createdAt: -1 }; // Default sort
        if (req.query.sort) {
            sortObject = {};
            const sortPairs = req.query.sort.split(',');
            sortPairs.forEach(pair => {
                const [field, order] = pair.split(':');
                sortObject[field] = order === 'asc' ? 1 : -1;
            });
        }

        // Build the aggregation pipeline
        const pipeline = [];

        // Match stage for filtering
        const matchConditions = {};
        
        // Add filters
        if (projectFilter) matchConditions.project = projectFilter;
        if (statusFilter) matchConditions.status = statusFilter;
        if (assignedToFilter) matchConditions.assignedTo = assignedToFilter;
        if (priorityFilter) matchConditions.priority = priorityFilter;
        
        // Date range filter
        if (dueDateFrom || dueDateTo) {
            matchConditions.dueDate = {};
            if (dueDateFrom) matchConditions.dueDate.$gte = new Date(dueDateFrom);
            if (dueDateTo) matchConditions.dueDate.$lte = new Date(dueDateTo);
        }

        // Add search functionality
        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search, 'i');
            const searchConditions = searchFields.map(field => ({
                [field]: searchRegex
            }));
            
            matchConditions.$or = searchConditions;
        }

        if (Object.keys(matchConditions).length > 0) {
            pipeline.push({ $match: matchConditions });
        }

        // Lookup for assignedTo user
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            role: 1
                        }
                    }
                ]
            }
        });

        // Lookup for createdBy user
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            role: 1
                        }
                    }
                ]
            }
        });

        // Lookup for project
        pipeline.push({
            $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "project",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            description: 1,
                            status: 1
                        }
                    }
                ]
            }
        });

        // Unwind arrays (since they're single references)
        pipeline.push({
            $unwind: {
                path: "$assignedTo",
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            $unwind: {
                path: "$createdBy",
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            $unwind: {
                path: "$project",
                preserveNullAndEmptyArrays: true
            }
        });

        // Add computed fields
        pipeline.push({
            $addFields: {
                id: "$_id",
                assignedToName: "$assignedTo.username",
                assignedToEmail: "$assignedTo.email",
                createdByName: "$createdBy.username",
                createdByEmail: "$createdBy.email",
                projectName: "$project.name",
                isOverdue: {
                    $and: [
                        { $lt: ["$dueDate", new Date()] },
                        { $ne: ["$status", "completed"] }
                    ]
                },
                daysUntilDue: {
                    $ceil: {
                        $divide: [
                            { $subtract: ["$dueDate", new Date()] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                }
            }
        });

        // Sort stage
        pipeline.push({
            $sort: sortObject
        });

        // Use aggregatePaginate for pagination
        const options = {
            page: page,
            limit: limit,
            customLabels: {
                totalDocs: 'totalDocs',
                docs: 'docs',
                limit: 'limit',
                page: 'page',
                nextPage: 'nextPage',
                prevPage: 'prevPage',
                totalPages: 'totalPages',
                pagingCounter: 'pagingCounter',
                hasPrevPage: 'hasPrevPage',
                hasNextPage: 'hasNextPage'
            }
        };

        const aggregate = Task.aggregate(pipeline);
        const result = await Task.aggregatePaginate(aggregate, options);

        res.status(200).json({
            message: "Tasks fetched successfully",
            ...result
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Simple function for basic listing without pagination
const getTasksSimple = async (req, res) => {
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

// Get task statistics
const getTaskStats = async (req, res) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: null,
                    totalTasks: { $sum: 1 },
                    pendingCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "pending"] }, 1, 0]
                        }
                    },
                    inProgressCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0]
                        }
                    },
                    completedCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
                        }
                    },
                    cancelledCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0]
                        }
                    },
                    lowPriorityCount: {
                        $sum: {
                            $cond: [{ $eq: ["$priority", "low"] }, 1, 0]
                        }
                    },
                    mediumPriorityCount: {
                        $sum: {
                            $cond: [{ $eq: ["$priority", "medium"] }, 1, 0]
                        }
                    },
                    highPriorityCount: {
                        $sum: {
                            $cond: [{ $eq: ["$priority", "high"] }, 1, 0]
                        }
                    },
                    urgentPriorityCount: {
                        $sum: {
                            $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0]
                        }
                    },
                    overdueCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ["$dueDate", new Date()] },
                                        { $ne: ["$status", "completed"] },
                                        { $ne: ["$status", "cancelled"] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalTasks: 1,
                    pendingCount: 1,
                    inProgressCount: 1,
                    completedCount: 1,
                    cancelledCount: 1,
                    lowPriorityCount: 1,
                    mediumPriorityCount: 1,
                    highPriorityCount: 1,
                    urgentPriorityCount: 1,
                    overdueCount: 1,
                    completionRate: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$completedCount", "$totalTasks"] },
                                    100
                                ]
                            },
                            1
                        ]
                    },
                    pendingPercentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$pendingCount", "$totalTasks"] },
                                    100
                                ]
                            },
                            1
                        ]
                    },
                    inProgressPercentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$inProgressCount", "$totalTasks"] },
                                    100
                                ]
                            },
                            1
                        ]
                    }
                }
            }
        ];

        const stats = await Task.aggregate(pipeline);
        const result = stats[0] || {
            totalTasks: 0,
            pendingCount: 0,
            inProgressCount: 0,
            completedCount: 0,
            cancelledCount: 0,
            lowPriorityCount: 0,
            mediumPriorityCount: 0,
            highPriorityCount: 0,
            urgentPriorityCount: 0,
            overdueCount: 0,
            completionRate: 0,
            pendingPercentage: 0,
            inProgressPercentage: 0
        };

        // Get recent tasks (last 7 days)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const recentTasks = await Task.countDocuments({
            createdAt: { $gte: lastWeek }
        });

        result.recentTasks = recentTasks;

        // Get tasks due this week
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const tasksDueThisWeek = await Task.countDocuments({
            dueDate: { 
                $gte: new Date(), 
                $lte: nextWeek 
            },
            status: { $nin: ["completed", "cancelled"] }
        });

        result.tasksDueThisWeek = tasksDueThisWeek;

        res.status(200).json({
            message: "Task statistics fetched successfully",
            data: result
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
    getTasks,        // Main function with aggregate pipeline for table
    getTasksSimple,  // Simple function for basic listing
    getTaskById,
    deleteTask,
    getTasksByProject,
    getTasksByUser,
    getTaskStats
}; 