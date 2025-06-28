const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.route");
const projectRoutes = require("./routes/project.route");
const taskRoutes = require("./routes/task.route");
const cors = require("cors");

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());

app.use(cors({
    origin: "*"
}))

// Routes
app.use("/api/users", userRoutes)

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



