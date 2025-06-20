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

const getAlUsers = async (req, res) => {
    try {

        const users = await User.find({}).select('-password')

        res.status(200).json({ data: users})
        
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



module.exports = {
    registerUser,
    getAlUsers,
    getUser,
    deleteUser,
    loginUser,
    updateUser
}