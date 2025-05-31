const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const  { username, email, password } = req.body;

        if(!username || !email || !password){
            res.status(400).json({message: "All fields are required"})
        }
        
        const user = await User.findOne({email})
        if(user){
            res.status(400).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            email,
            hashedPassword
        })

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)

        res.status(201).json({message: "User created successfully" , token})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getAlUsers = async (req, res) => {
    try {

        const users = await User.find({})

        res.status(200).json({ data: users})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getUser = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id)

        res.status(200).json({ data: user})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const deleteUser = async (req, res) => {
    try {

        const { id } = req.params;

        await User.findByIdAndDelete(id)

        res.status(200).json({ message: "User deleted successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}



module.exports = {
    registerUser,
    getAlUsers,
    getUser,
    deleteUser
}