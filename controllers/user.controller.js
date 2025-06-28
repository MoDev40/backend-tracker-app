const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const  { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            email,
            password:hashedPassword
        })

        const token = jwt.sign({user: newUser}, process.env.JWT_SECRET)

        res.status(201).json({message: "User created successfully" , token})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const loginUser = async(req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({message: "Invalid credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({user: user}, process.env.JWT_SECRET)

        res.status(200).json({message: "Login successful", token, data: user})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

// Updated function with aggregate pipeline for table functionality
const getAlUsers = async (req, res) => {
    try {
        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const searchFields = req.query.searchFields ? req.query.searchFields.split(',') : ['username', 'email', 'role'];
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        
        // Parse sort parameter if it's in "field:order" format
        let sortObject = {};
        if (req.query.sort) {
            const sortPairs = req.query.sort.split(',');
            sortPairs.forEach(pair => {
                const [field, order] = pair.split(':');
                sortObject[field] = order === 'asc' ? 1 : -1;
            });
        } else {
            sortObject[sortField] = sortOrder;
        }

        // Build the aggregation pipeline
        const pipeline = [];

        // Match stage - search functionality
        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search, 'i');
            const searchConditions = searchFields.map(field => ({
                [field]: searchRegex
            }));
            
            pipeline.push({
                $match: {
                    $or: searchConditions
                }
            });
        }

        // Add fields for response (exclude password)
        pipeline.push({
            $addFields: {
                id: "$_id",
                name: "$username", // Map username to name for frontend compatibility
                type: "$role", // Map role to type for frontend compatibility
            }
        });

        // Project stage - exclude sensitive data
        pipeline.push({
            $project: {
                password: 0
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

        const aggregate = User.aggregate(pipeline);
        const result = await User.aggregatePaginate(aggregate, options);

        res.status(200).json({
            message: "Users fetched successfully",
            ...result
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

// Alternative simpler function for basic listing
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ data: users});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getUser = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id).select('-password')

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ data: user})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const deleteUser = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findByIdAndDelete(id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ message: "User deleted successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const updateUser = async(req, res) => {
    try {

        const { id } = req.params;

        const { username, email, role } = req.body;

        const user = await User.findByIdAndUpdate(id, { username, email, role }, { new: true }).select('-password')

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        res.status(200).json({message: "User updated successfully", data: user})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

// Get user statistics
const getUserStats = async (req, res) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    adminCount: {
                        $sum: {
                            $cond: [{ $eq: ["$role", "admin"] }, 1, 0]
                        }
                    },
                    userCount: {
                        $sum: {
                            $cond: [{ $eq: ["$role", "user"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalUsers: 1,
                    adminCount: 1,
                    userCount: 1,
                    adminPercentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$adminCount", "$totalUsers"] },
                                    100
                                ]
                            },
                            1
                        ]
                    },
                    userPercentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$userCount", "$totalUsers"] },
                                    100
                                ]
                            },
                            1
                        ]
                    }
                }
            }
        ];

        const stats = await User.aggregate(pipeline);
        const result = stats[0] || {
            totalUsers: 0,
            adminCount: 0,
            userCount: 0,
            adminPercentage: 0,
            userPercentage: 0
        };

        // Get recent users (last 7 days)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: lastWeek }
        });

        result.recentUsers = recentUsers;

        res.status(200).json({
            message: "User statistics fetched successfully",
            data: result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    registerUser,
    getAlUsers, // Main function with aggregate pipeline for table
    getUsers,   // Simple function for basic listing
    getUser,
    deleteUser,
    loginUser,
    updateUser,
    getUserStats
}