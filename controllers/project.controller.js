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



const GetProjects = async(req, res) => {
    try {

        const projects = await Project.find({})
            .populate("createdBy", "username email")
            .populate("members", "username email")
            .sort({ createdAt: -1 })

        if(!projects || projects.length === 0){
            return res.status(404).json({message: "No projects found"})
        }

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


module.exports = {
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    GetProjects
}