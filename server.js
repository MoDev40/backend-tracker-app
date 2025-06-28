const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.route");
<<<<<<< HEAD
const taskRoutes = require("./routes/task.route");


=======
const projectRoutes = require("./routes/project.route");
const taskRoutes = require("./routes/task.route");
const cors = require("cors");
>>>>>>> 46c358a8a48fbca4e453ef957635a39998f6cc88

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());

app.use(cors({
    origin: "*"
}))

// Routes
app.use("/api/users", userRoutes)
<<<<<<< HEAD
app.use("/api/tasks",taskRoutes)
=======
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)
>>>>>>> 46c358a8a48fbca4e453ef957635a39998f6cc88

app.get('/', (req, res) => {
    res.status(200).json({message: 'Health Check - Tracker API is running'})
})


// Global error handler
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



