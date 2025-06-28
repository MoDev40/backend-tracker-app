const Project = require("../models/project.schema")

const createProject = async(req, res) => {
    try {

        const { name, description, members} = req.body

        const createdBy = req.user?._id

        const project = await Project.create({
            name, description, createdBy, members
        })

        if(!project){
            return res.status(400).json({message: "Failed to create project"})
        }

        const populatedProject = await Project.findById(project._id)
            .populate("createdBy", "username email")
            .populate("members", "username email")

        res.status(201).json({message: "Project created successfully", data: populatedProject})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const updateProject = async(req, res) => {
    try {

        const { name, description, members, status} = req.body
        const { id } = req.params
        const updateData = {
            name, description, members, status
        }
     
        const project = await Project.findByIdAndUpdate(id, updateData, { new:true})
            .populate("createdBy", "username email")
            .populate("members", "username email")

        if(!project){
            return res.status(404).json({message: "Project not found"})
        }
        res.status(200).json({message: "Project updated successfully", data: project})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

// Updated function with aggregate pipeline for table functionality
const getProjects = async(req, res) => {
    try {
        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const searchFields = req.query.searchFields ? req.query.searchFields.split(',') : ['name', 'description', 'status'];
        const status = req.query.status; // Filter by status if provided
        
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
        
        // Add status filter if provided
        if (status) {
            matchConditions.status = status;
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

        // Lookup for members
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "members",
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

        // Unwind createdBy (since it's a single reference)
        pipeline.push({
            $unwind: {
                path: "$createdBy",
                preserveNullAndEmptyArrays: true
            }
        });

        // Add computed fields
        pipeline.push({
            $addFields: {
                id: "$_id",
                memberCount: { $size: "$members" },
                createdByName: "$createdBy.username",
                createdByEmail: "$createdBy.email"
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

        const aggregate = Project.aggregate(pipeline);
        const result = await Project.aggregatePaginate(aggregate, options);

        res.status(200).json({
            message: "Projects fetched successfully",
            ...result
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

// Simple function for basic listing without pagination
const getProjectsSimple = async(req, res) => {
    try {
        const projects = await Project.find({})
            .populate("createdBy", "username email")
            .populate("members", "username email")
            .sort({ createdAt: -1 })

        res.status(200).json({message: "Projects fetched successfully", data: projects})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getProjectById = async(req, res) => {
    try {

        const { id } = req.params

        const project = await Project.findById(id)
            .populate("createdBy", "username email")
            .populate("members", "username email")

        if(!project){
            return res.status(404).json({message: "Project not found"})
        }

        res.status(200).json({message: "Project fetched successfully", data: project})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const deleteProject = async(req, res) => {
    try {

        const { id } = req.params

        const project = await Project.findByIdAndDelete(id)

        if(!project){
            return res.status(404).json({message: "Project not found"})
        }

        res.status(200).json({message: "Project deleted successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

// Get project statistics
const getProjectStats = async (req, res) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: null,
                    totalProjects: { $sum: 1 },
                    activeCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "active"] }, 1, 0]
                        }
                    },
                    completedCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
                        }
                    },
                    archivedCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "archived"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalProjects: 1,
                    activeCount: 1,
                    completedCount: 1,
                    archivedCount: 1,
                    activePercentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$activeCount", "$totalProjects"] },
                                    100
                                ]
                            },
                            1
                        ]
                    },
                    completedPercentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$completedCount", "$totalProjects"] },
                                    100
                                ]
                            },
                            1
                        ]
                    }
                }
            }
        ];

        const stats = await Project.aggregate(pipeline);
        const result = stats[0] || {
            totalProjects: 0,
            activeCount: 0,
            completedCount: 0,
            archivedCount: 0,
            activePercentage: 0,
            completedPercentage: 0
        };

        // Get recent projects (last 30 days)
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        
        const recentProjects = await Project.countDocuments({
            createdAt: { $gte: lastMonth }
        });

        result.recentProjects = recentProjects;

        // Get average team size
        const teamSizeStats = await Project.aggregate([
            {
                $group: {
                    _id: null,
                    avgTeamSize: { $avg: { $size: "$members" } },
                    maxTeamSize: { $max: { $size: "$members" } },
                    minTeamSize: { $min: { $size: "$members" } }
                }
            }
        ]);

        if (teamSizeStats[0]) {
            result.avgTeamSize = Math.round(teamSizeStats[0].avgTeamSize * 10) / 10;
            result.maxTeamSize = teamSizeStats[0].maxTeamSize;
            result.minTeamSize = teamSizeStats[0].minTeamSize;
        }

        res.status(200).json({
            message: "Project statistics fetched successfully",
            data: result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjects, // Main function with aggregate pipeline for table
    getProjectsSimple,  // Simple function for basic listing
    getProjectStats
}